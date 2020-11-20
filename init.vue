<template>
    <div v-if="!lineLogin">
      <line-login-button         
        client-id="1654882851"
        callback-uri="https://xxx.ak-platform.com:8443/"
        client-secret="3454394a8452a11ce9130ab5983ca8e2"
        @result="result" >
      </line-login-button>
    </div>    
    <div  v-else>
      <div class="row justify-content-start ">
        <img :src="oRMM.pictureUrl" class="userImg">     
        <label class="displayName">{{oRMM.displayName}} </label>
      </div>        
      <div  class="row justify-content-center" >
        <button type="button" class="btn btn-primary addBtn"  @click="openModal()" >新增</button>         
        <button type="button" class="btn btn-primary editBtn"  @click="editMode()" >修改</button>     
        <button type="button" class="btn btn-primary delBtn"  @click="deleteMode()" >刪除</button>   
      </div>  
      <v-client-table :columns="columns" :data="dataList" :options="tableOptions" style="margin-top: 25px;">
        <div slot="edit" slot-scope="props">
          <div
            class="btn btn-secondary btn-micro btn-with-icon rounded-icon"
            @click="edit(props.row)"
          >
            <i class="fa fa-pencil-alt"></i>
          </div>
        </div>
        <div slot="delete" slot-scope="props">
          <div
            class="btn btn-secondary btn-micro btn-with-icon rounded-icon"
            @click="delete(props.row)"
          >
            <i class="fa fa-trash"></i>
          </div>
        </div>
      </v-client-table>      
      <div  class="row justify-content-center" >         
        <button type="button" class="btn btn-primary"  @click="sendToBoss()" >送出</button>      
      </div>        
      <vuestic-modal
        v-bind:force="true"
        v-bind:large="true"
        ref="XInfo"
        @cancel="cancelModal()"
      >
        <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="fullPage"></loading>
        <div slot="title"></div>
        <div>
          <div class="row justify-content-start">
            <vuestic-radio-button
              class="radioBtn"
              label="全車"
              id="allType"
              value="allType"
              v-model="actionType"
              name="actionType"
            />            
            <vuestic-radio-button
              class="radioBtn"
              label="連碰"
              id="postType"
              value="postType"
              v-model="actionType"
              name="actionType"
            />
            <vuestic-radio-button
              class="radioBtn"
              label="柱碰"
              id="linkType"
              value="linkType"
              v-model="actionType"
              name="actionType"
            /> 
          </div>     
          <div class="row justify-content-center">
            <div  v-for="(ball, index) in balls" :key="index">
              <div v-if="actionType === 'allType'" class="input-group" style="margin-top: 5px">
                <button :id="ball" :ref="ball" type="button" class="ballBtn" >{{ball}}</button>
                <input class="allTypeInput" @change="clickCar($event.target.value, ball)" name="carPriceInput" type="number" />車      
              </div>
              <div v-else class="input-group">
                <button :id="ball" :ref="ball" type="button" class="ballBtn"  @click="changeBallColor(ball)" >{{ball}}</button>
              </div>              
            </div>          
          </div>                                     
          <div v-if="actionType !== 'allType'"  class="row" style="margin-top: 10px">
            <label
              class="code-label"
            >二星</label>            
            <div class="input-group" style="margin-left: 35px">
              每碰金額<input class="codeInput" name="twoCodeInput" :v-model="twoCodeInput" type="number" v-validate="'required'" />
            </div>             
            <label
              class="code-label"
            >三星</label>            
            <div class="input-group" style="margin-left: 35px">
              每碰金額<input class="codeInput" name="threeCodeInput" :v-model="threeCodeInput" type="number" v-validate="'required'" />
            </div>             
            <label
              class="code-label"
            >四星</label>            
            <div class="input-group" style="margin-left: 35px">
              每碰金額<input class="codeInput" name="fourCodeInput" :v-model="fourCodeInput" type="number" v-validate="'required'" />
            </div> 
            <!--<div class="col-md-12">
              <fieldset>
                <div
                  class="form-group with-icon-right"
                >
                  <div class="input-group">
                    <input name="XCodeInput" v-model="XCodeInput" v-validate="'required'" />
                    <i class="fa fa-exclamation-triangle error-icon icon-right input-icon"></i>
                    <i class="fa fa-check valid-icon icon-right input-icon"></i>
                    <label
                      class="control-label"
                      for="XCodeInput"
                    >二星每碰金額</label>
                    <i class="bar"></i>
                  </div>
                </div>
              </fieldset>            
            </div> -->                           
          </div>                          
        </div>
        <div slot="footer">
          <button
            type="button"
            class="btn btn-primary"
            v-on:click="addOrder()"
          >確認新增</button>
        </div>
      </vuestic-modal>           
    </div> 
</template>

<script>
import Vue from 'vue'
import VueLoading from "vue-loading-overlay"
import RMMGlobal from '@/util/RMMGlobal'
import '@team-decorate/vue-line-login/dist/vue-line-login.css'
import VueLineLogin from '@team-decorate/vue-line-login'
import { ClientTable } from 'vue-tables-2'
import VeeValidate from 'vee-validate'
Vue.use(ClientTable)
import Apis from '@/util/Apis'
let self = {};
export default {
  name: "v-main",
  components: {
    loading: VueLoading,
    lineLoginButton: VueLineLogin
  },
  data() {
    return {
      isLoading: false,
      fullPage: false,   
      columns: ['type', 'numbers', 'xCode'],
      dataList: [],
      addFriend: false,
      friendRequired: false,   
      XCodeInput: '',
      twoCodeInput: '',
      threeCodeInput: '',
      fourCodeInput: '',
      nameInput: '',
      oRMM: RMMGlobal.get(),
      verify: false,
      lineLogin: false,
      actionType: 'allType',
      tmpActionType: 'allType',
      balls: ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39'],
      //balls1: ['01','02','03','04','05','06','07','08'],
      //balls2: ['09','10','11','12','13','14','15','16'],
      //balls3: ['17','18','19','20','21','22','23','24'],
      //balls4: ['25','26','27','28','29','30','31','32'],
      //balls5: ['33','34','35','36','37','38','39'],
      btnColor: false,
      allCarList: [],
      carPriceInput: '',
      postList: [],
      linkList: [],
    };
  },
  created () {

  },
  mounted() {
    self = this;    
    self.tmpActionType = self.actionType
    //let id = self.GetURLParameter('id')
    //let password = self.GetURLParameter('password')
    //if(id !== '' && password !== ''){
    //  self.getSignInfo(id, password)
    //}
    //self.lineLogin = true
    ////self.oRMM.userId = 'Uf3bb516f60a62154f96418ca5f2bd54a'
    //self.oRMM.displayName = 'XXX'
    //self.oRMM.pictureUrl = 'https://profile.line-scdn.net/0h4aqxPei0a05MAUCyQuwUGXBEZSM7L20GNGcsKm4DNHwyYygZJWItLDxUMStjYX9PeWd0LWEAN3tk'    
  },  
  watch: {
    actionType (data) {   
      if(data !== self.tmpActionType){
        self.tmpActionType = data
        self.clearBalls()
        self.allCarList = []
        self.linkList = []
        self.postList = []
      }
    }
  },  
  computed: {
    tableOptions () {
      return {
        resizableColumns: false,
        filterByColumn: false,
        filterable: false,
        headings: {
          edit: '修改',
          delete: '刪除',
          numbers: '號碼',
          xCode: 'X碼',
          type: '類別'
        },
        sortable: [],
        texts: {
          count: ' ',
          first: '第一頁',
          last: '最後一頁',
          filter: ' ',
          filterPlaceholder: ' ',
          limit: ' ',
          page: ' ',
          noResults: ' ',
          filterBy: '',
          loading: '載入中...',
          defaultOption: '',
          columns: '',
          configData: {},
          btnEdit: false,
          delBtnEdit: false,
        }        
      }
    }
  },  
  methods: {
    openModal () {
      self.$refs.XInfo.open()
    },   
    cancelModal () {
      //self.clearInput()
      self.$refs.XInfo.close()
    },  
    clickCar(val, ball) {
      self.allCarList.push({ball: ball, price: val})
      let ballRef = this.$refs[ball]
      let btnBackground = ballRef[0]      
      if(val !== ''){
        btnBackground.style.backgroundColor = '#ff3a3a'
        btnBackground.style.backgroundImage='none'
      }else{
        btnBackground.style.backgroundColor = '#fff'
        btnBackground.style.backgroundImage='url(/static/img/home/ball.jpg)'
      }
      self.changeBallColor
    },
    clearBalls () {
      for(let i = 0 ; i < self.balls.length ; i++){
        let ball = self.balls[i]
        let ballRef = this.$refs[ball]
        let btnBackground = ballRef[0]
        btnBackground.style.backgroundColor = '#fff'
        btnBackground.style.backgroundImage='url(/static/img/home/ball.jpg)'        
      }
    },
    changeBallColor (ball) {    
      let ballRef = this.$refs[ball]
      let btnBackground = ballRef[0]
      if(btnBackground.style.backgroundColor === 'rgb(255, 58, 58)' || btnBackground.style.backgroundColor === '#ff3a3a'){
        btnBackground.style.backgroundColor = '#fff'
        btnBackground.style.backgroundImage='url(/static/img/home/ball.jpg)'
      }else{
        btnBackground.style.backgroundColor = '#ff3a3a'
        btnBackground.style.backgroundImage='none'
      }
      debugger
      this.btnColor = !this.btnColor
      if(self.actionType === 'postType'){
        self.postList.push(ball)
      }else if(self.actionType === 'linkType'){
        
        self.linkList.push(ball)
      }
    },  
    sendToBoss () {
      debugger
      let ballRef = this.$refs
    },      
    getSignInfo: function (id, password) {
      this.isLoading = true
      Apis.sign.get
        .getSignInfo(id)
        .then(function (xhr) {
          self.isLoading = false
          if (xhr.data) {
            if(xhr.data.Result[0].length = 1){
              let tmpReply = xhr.data.Result[0].replyToken
              if(tmpReply === password){
                self.oRMM.id = id
                self.oRMM.password = password
                RMMGlobal.set(self.oRMM)         
                self.verify = true
                //self.$router.push('home')
              }
            }
          }
        })
        .catch(function (error) {
          self.isLoading = false
        })
    },     
    GetURLParameter: function (sParam) {
      var sPageURL = window.location.search.substring(1)
      var sURLVariables = sPageURL.split('&')
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=')
        if (sParameterName[0] === sParam) {
          return sParameterName[1]
        }
      }
      return ''
    },
    result(res) {
      if(res.access_token){
        self.lineLogin = true
        self.oRMM.userId = res.userId
        self.oRMM.displayName = res.displayName
        self.oRMM.pictureUrl = res.pictureUrl
        RMMGlobal.set(self.oRMM)             
      }
      console.log(self.lineLogin)
      console.log(res)
    },
    editMode () {
      if(this.delBtnEdit){
        this.columns.splice(this.columns.indexOf('delete'), 1)
        this.delBtnEdit = !this.delBtnEdit
      }      
      if (this.btnEdit) {
        // this.columns.splice(this.columns.indexOf("schedule"), 1);
        this.columns.splice(this.columns.indexOf('edit'), 1)
        //this.columns.splice(this.columns.indexOf('delete'), 1)
      } else {
        // this.columns.unshift("schedule");
        this.columns.unshift('edit')
        //this.columns.unshift('delete')
      }
      this.btnEdit = !this.btnEdit
    },    
    deleteMode () {
      if(this.btnEdit){
        this.columns.splice(this.columns.indexOf('edit'), 1)
        this.btnEdit = !this.btnEdit
      }
      if (this.delBtnEdit) {
        // this.columns.splice(this.columns.indexOf("schedule"), 1);
        this.columns.splice(this.columns.indexOf('delete'), 1)
        //this.columns.splice(this.columns.indexOf('delete'), 1)
      } else {
        // this.columns.unshift("schedule");
        this.columns.unshift('delete')
        //this.columns.unshift('delete')
      }
      this.delBtnEdit = !this.delBtnEdit
    },  
    addOrder() {
      if(self.actionType === 'linkType'){
        let numStr = ''
        for(let i = 0 ; i < self.linkList.length ; i++){
          numStr = numStr + self.linkList[i] + ','
        }
        self.dataList.push({type: '連碰', numbers: numStr, xCode: 100})
      }else if(self.actionType === 'postType'){
        let numStr = ''
        for(let i = 0 ; i < self.postList.length ; i++){
          numStr = numStr + self.postList[i] + ','
        }        
        self.dataList.push({type: '柱碰', numbers: 20, xCode: 100})
      }else{
        let numStr = ''
        for(let i = 0 ; i < self.allCarList.length ; i++){
          numStr = numStr + self.allCarList[i] + ','
        }         
        self.dataList.push({type: '全車', numbers: 20, xCode: 100})
      }
      self.$refs.XInfo.close()
    } ,   
    edit(){

    },
    delete(){

    },           
  },
  beforeDestroy() {}
};
</script>

<style scoped lang="scss">
.userImg {
  margin-left: 30px;
  margin-top: 6px;
  width: 70px;
  max-height: 70px;
	border-radius: 50%;
	border: 1px solid #fff;  
}
.displayName {
  margin-left: 13px;
  margin-top: 10px;
  font-size: 33px;
}
.addBtn {
  margin-right: 25px;
  margin-top: 49px;
}
.delBtn {
  margin-left: 25px;
  margin-top: 49px;
}
.editBtn {
  margin-top: 49px;
}
.radioBtn {
  margin-left: 20px;
}
.ballBtn{
  border-radius: 50%;
  border: none;
  background-image: url('/static/img/home/ball.jpg');
  outline: 0;
  margin: 2px;
  width: 30px;
  max-height: 30px;  
}
.allTypeInput{
  width: 50px;
}
.code-label{
  font-size: 20px;
  color: #a51010;
  margin-left: 16px;  
}
.codeInput{
  margin-left: 4px;
  width: 50px;
}
</style>