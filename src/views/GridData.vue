<template>
  <div>
    <form id="search">
      查询 <input name="query" v-model="searchQuery">
    </form>
    <grid-data-list
        :data="gridData"
        :columns="gridColumns"
        :filter-key="searchQuery"
    >
    </grid-data-list>
  </div>
</template>

<script>
import gridDataList from "@/components/gridDataList.vue";

export default {
  components: {
    gridDataList
  },
  data: () => ({
    searchQuery: '',
    gridColumns: ['name', 'power'],
    gridData: [
      { name: 'Chuck Norris', power: Infinity },
      { name: 'Bruce Lee', power: 9000 },
      { name: 'Jackie Chan', power: 7000 },
      { name: 'Jet Li', power: 8000 }
    ]
  })
}
</script>
