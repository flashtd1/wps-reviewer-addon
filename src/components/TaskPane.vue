<template>
<div class="global">
  <div class="divItem">
    <div>文档文件名为：<span>{{docName}}</span></div>
    <el-button type="primary" size="mini" @click="review">分析</el-button>
    <el-button type="primary" size="mini" @click="clearHighlight">清空批注</el-button>
  </div>
  <div class="review-result">
    <h4>审校结果</h4>
    <el-table
      v-loading="isLoading"
      :data="datas"
      style="width: 100%">>
      <el-table-column 
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column 
        prop="tag"
        label="词性"
        width="80">
      </el-table-column>
      <el-table-column 
        prop="count"
        label="出现次数"
        width="180">
      </el-table-column>
      <el-table-column 
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="highlight(scope.row.tag)">高亮该词性</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import taskPane from './js/taskpane.js'
import taskpane from './js/taskpane.js'
let words = []
export default {
  name: 'TaskPane',
  data(){
    return {
      docName: '',
      datas: []
    }
  },
  methods:{
    onbuttonclick(id){
      return taskPane.onbuttonclick(id)
    },
    onDocNameClick(){
      this.docName = taskPane.onbuttonclick('getDocName')
    },
    onGetDoc () {
      return taskPane.onbuttonclick('getString')
    },
    async review () {
      this.isLoading = true
      let text = this.onGetDoc()
      console.log(text)
      let res = await axios.post('http://localhost:5020', { text})
      words = res.data
      let resData = res.data.reduce((result, current) => {
        let c = result.find((r) => {
          return r.tag == current.tag
        })
        console.log(c, current)
        if (!c) {
          result.push({
            tag: current.tag,
            count: 1
          })
        } else {
          c.count ++ 
        }
        return result
      }, [])
      console.log(resData)
      this.datas = resData
      this.isLoading = false
    },
    getTagWords (tag) {
      return words.filter((w) =>{
        return w.tag == tag
      })
    },
    clearHighlight() {
      taskpane.clearHighlight()
    },
    highlight (tag) {
      let ns = this.getTagWords(tag)
      console.log(`所有${tag}的词`, ns)
      taskPane.hilight(ns)
    }
  },
  mounted() {
    this.onDocNameClick()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.global{
        font-size: 15px;
        min-height: 95%;
    }
.divItem{
    margin-left: 5px;
    margin-bottom: 18px;
    font-size: 15px;
    word-wrap:break-word;
}
</style>
