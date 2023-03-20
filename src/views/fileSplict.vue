<template>
  <div>
    <!-- 上传组件 -->
    <el-upload action drag :auto-upload="false" :show-file-list="false" :on-change="handleChange">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">大小不超过 200M 的视频</div>
    </el-upload>

    <!-- 进度显示 -->
    <div class="progress-box">
      <span>上传进度：{{ percent.toFixed() }}%</span>
      <el-button type="primary" size="mini" @click="handleClickBtn">{{ upload | btnTextFilter }}</el-button>
    </div>

    <!-- 展示上传成功的视频 -->
    <div v-if="videoUrl">
      <video :src="videoUrl" controls/>
    </div>
    <el-divider></el-divider>
    <el-button size="medium" @click="exportToExcel">导出xlsx</el-button>
    <el-divider></el-divider>
    <el-upload
        drag
        action
        accept=".xlsx, .xls"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="changeFile"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <em>点击上传</em>
      </div>
    </el-upload>
    <el-divider></el-divider>
    <el-button size="medium" @click="downloadExcel">模板下载</el-button>
  </div>
</template>

<script>
// import SparkMD5 from "spark-md5"
// import axios from "axios"
import FileSaver from "file-saver";
import XLSX from "xlsx";
import xlsxToJson from "@/utils/xlsx";

export default {
  name: 'App3',
  filters: {
    btnTextFilter(val) {
      return val ? '暂停' : '继续'
    }
  },
  data() {
    return {
      percent: 0,
      videoUrl: '',
      upload: true,
      percentCount: 0
    }
  },
  methods: {
    async handleChange(file) {
      if (!file) return
      this.percent = 0
      this.videoUrl = ''
      // 获取文件并转成 ArrayBuffer 对象
      const fileObj = file.raw
      let buffer
      try {
        buffer = await this.fileToBuffer(fileObj)
      } catch (e) {
        console.log(e)
      }

      // 将文件按固定大小（2M）进行切片，注意此处同时声明了多个常量
      const chunkSize = 2097152,
          chunkList = [], // 保存所有切片的数组
          chunkListLength = Math.ceil(fileObj.size / chunkSize), // 计算总共多个切片
          suffix = /\.([0-9A-z]+)$/.exec(fileObj.name)[1] // 文件后缀名

      // 根据文件内容生成 hash 值
      const spark = new SparkMD5.ArrayBuffer()
      spark.append(buffer)
      const hash = spark.end()

      // 生成切片，这里后端要求传递的参数为字节数据块（chunk）和每个数据块的文件名（fileName）
      let curChunk = 0 // 切片时的初始位置
      for (let i = 0; i < chunkListLength; i++) {
        const item = {
          chunk: fileObj.slice(curChunk, curChunk + chunkSize),
          fileName: `${hash}_${i}.${suffix}` // 文件名规则按照 hash_1.jpg 命名
        }
        curChunk += chunkSize
        chunkList.push(item)
      }
      this.chunkList = chunkList // sendRequest 要用到
      this.hash = hash // sendRequest 要用到
      this.sendRequest()
    },

    // 发送请求
    sendRequest() {
      const requestList = [] // 请求集合
      this.chunkList.forEach((item, index) => {
        const fn = () => {
          const formData = new FormData()
          formData.append('chunk', item.chunk)
          formData.append('filename', item.fileName)
          // return axios({
          //   url: '/single3',
          //   method: 'post',
          //   headers: { 'Content-Type': 'multipart/form-data' },
          //   data: formData
          // }).then(res => {
          //   if (res.data.code === 0) { // 成功
          //     if (this.percentCount === 0) { // 避免上传成功后会删除切片改变 chunkList 的长度影响到 percentCount 的值
          //       this.percentCount = 100 / this.chunkList.length
          //     }
          //     this.percent += this.percentCount // 改变进度
          //     this.chunkList.splice(index, 1) // 一旦上传成功就删除这一个 chunk，方便断点续传
          //   }
          // })
        }
        requestList.push(fn)
      })

      let i = 0 // 记录发送的请求个数
      // 文件切片全部发送完毕后，需要请求 '/merge' 接口，把文件的 hash 传递给服务器
      const complete = () => {
        // axios({
        //   url: '/merge',
        //   method: 'get',
        //   params: { hash: this.hash }
        // }).then(res => {
        //   if (res.data.code === 0) { // 请求发送成功
        //     this.videoUrl = res.data.path
        //   }
        // })
      }
      const send = async () => {
        if (!this.upload) return
        if (i >= requestList.length) {
          // 发送完毕
          complete()
          return
        }
        await requestList[i]()
        i++
        send()
      }
      send() // 发送请求
    },

    // 按下暂停按钮
    handleClickBtn() {
      this.upload = !this.upload
      // 如果不暂停则继续上传
      if (this.upload) this.sendRequest()
    },

    // 将 File 对象转为 ArrayBuffer
    fileToBuffer(file) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader()
        fr.onload = e => {
          resolve(e.target.result)
        }
        fr.readAsArrayBuffer(file)
        fr.onerror = () => {
          reject(new Error('转换文件格式发生错误'))
        }
      })
    },
    // 导出
    exportToExcel() {
      const loading = this.$loading({
        fullscreen: false,
        text: "正在处理中...",
        background: "rgba(0,0,0,.1)",
      });
      var table = [];
      var index = 1;
      var totals = 2;
      do {
        let data = [
          {
            name: 'yepi',
            identity: '贵族',
            tags: '好',
            message: '有',
            datetime: '2023-03-20',
            status: 0
          },
          {
            name: 'yepi-bit',
            identity: '贵族',
            tags: 'good',
            message: '有',
            datetime: '2023-03-19',
            status: 1
          }
        ]
        for (let pass of data) {
          var params = {
            姓名: pass.name,
            身份证号: pass.identity,
            布控标签: pass.tags,
            报警类型: pass.message,
            报警时间: pass.datetime,
            处理状态: pass.status === 0 ? "待处理" : "已处理",
          };
          table.push(params);
        }
        index++;
      } while (table.length < totals);
      let date = new Date();
      var filename =
          "报警记录" +
          date.getFullYear().toString() +
          (date.getMonth() + 1).toString() +
          date.getDate().toString() +
          ".xlsx";
      this.ToExcel(table, filename);
      loading.close();
    },
    ToExcel(data, filename) {
      //取数据 导出
      var wopts = {
        bookType: "xlsx",
        bookSST: true,
        type: "binary",
      };
      var workBook = {
        SheetNames: ["Sheet1"],
        Sheets: {},
        Props: {},
      };
      //1、XLSX.utils.json_to_sheet(data) 接收一个对象数组并返回一个基于对象关键字自动生成的“标题”的工作表，默认的列顺序由使用Object.keys的字段的第一次出现确定
      //2、将数据放入对象workBook的Sheets中等待输出
      workBook.Sheets["Sheet1"] = XLSX.utils.json_to_sheet(data);

      //3、XLSX.write() 开始编写Excel表格
      //4、changeData() 将数据处理成需要输出的格式

      FileSaver.saveAs(
          new Blob([this.changeData(XLSX.write(workBook, wopts))], {
            type: "application/octet-stream",
          }),
          filename
      );
    },
    changeData(s) {
      //如果存在ArrayBuffer对象(es6) 最好采用该对象
      if (typeof ArrayBuffer !== "undefined") {
        //1、创建一个字节长度为s.length的内存区域
        var buf = new ArrayBuffer(s.length);

        //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
        var view = new Uint8Array(buf);

        //3、返回指定位置的字符的Unicode编码
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
    },
    // 批量导入
    async changeFile(ev) {
      // 获取文件
      let file = ev.raw;
      if (!file) return;
      const loading = this.$loading({
        text: "正在玩命为您处理中...",
        background: "rgba(0,0,0,.5)",
      });
      // 基于XLSX把文件解析为JSON
      let result = await xlsxToJson.readFile(file);
      let weetbook = XLSX.read(result, { type: "binary" }),
          weetsheek = weetbook.Sheets[weetbook.SheetNames[0]];
      result = XLSX.utils.sheet_to_json(weetsheek);
      result = xlsxToJson.formatWeetJSON(result);
      // 把数据逐一上传到服务器端
      let index = -1;
      let complete = (flag) => {
        loading.close();
        xlsxToJson.message(this, {
          message: `总共 ${result.length} 条数据，已经成功导入 ${
              index + 1
          } 条数据！${
              flag ? "所有信息都已导入~~" : "导入过程中遇到问题，已经结束导入~~"
          }`,
          type: flag ? "success" : "warning",
          onClose: () => {
            //  this.$router.push("/");
            // this.dialogImport = false;
            // this.getWhitleList();
          },
        });
      };
      let send = async () => {
        if (index >= result.length - 1) {
          // 都传递成功了
          complete(true);
          return;
        }
        let item = result[++index];
        // let res = this.addCustom(item); //后端接口 自行更换
        // if (res.code == 0) {
        send();
        //     return;
        // }
        // 上传中遇到问题，结束上传
        // complete(false);
      };
      send();
    },
    downloadExcel() {
      // 自定义文件
      const userAgent = navigator.userAgent;
      let url="/xx.xlsx";
      if (userAgent.indexOf("Firefox") > -1) {
        window.location.href = url
      } else if (userAgent.indexOf("Chrome") > -1) {
        const aTag = document.createElement("a");
        aTag.setAttribute("download", "");
        aTag.setAttribute("href", url);
        aTag.click();
      } else {
        const aTag = document.createElement("a");
        aTag.setAttribute("download", "");
        aTag.setAttribute("href", url);
        aTag.click();
      }
    },
  }
}
</script>

<style scoped>
.progress-box {
  box-sizing: border-box;
  width: 360px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 8px 10px;
  background-color: #ecf5ff;
  font-size: 14px;
  border-radius: 4px;
}
/deep/ .el-upload {
  width: 178px !important;
  height: 178px !important;
}
/deep/ .el-icon-plus {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.pic {
  width: 45px;
  height: calc(45px * 1.235);
}
</style>