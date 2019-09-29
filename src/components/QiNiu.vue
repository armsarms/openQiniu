<template>
  <div id="qiniu" class="qiniu">
    <input @change="uploadInputchange" id="uploadFileInput" type="file" multiple />
  </div>
</template>

<script>
// import * as qiniu from "qiniu-js";
import axios from "axios";
import { eventBus } from "../main";
export default {
  data() {
    return {
      res: {
        uptoken:
          "dqW9Q7PGZKYXSxytRh2bUfT45TT4s2Ls9a6TTVZW:xZHssbPYGA7HzxydJJ4vm21qO84=:eyJkZWxldGVBZnRlckRheXMiOjEsInJldHVybkJvZHkiOiJ7XCJrZXlcIjpcIiQoa2V5KVwiLFwiaGFzaFwiOlwiJChldGFnKVwiLFwiZnNpemVcIjokKGZzaXplKSxcImJ1Y2tldFwiOlwiJChidWNrZXQpXCIsXCJuYW1lXCI6XCIkKHg6bmFtZSlcIn0iLCJzY29wZSI6InRvdXdhLWVyaW8iLCJkZWFkbGluZSI6MTU3Njk0NDYxOH0=",
        domain: "http://pyh8k7w0c.bkt.clouddn.com/"
      },
      fileName: [],
      fileLength: 0
    };
  },
  mounted() {},
  methods: {
    //触发input change事件
    uploadInputchange() {
      let files = document.getElementById("uploadFileInput").files; //选择的图片文件
      this.fileLength = files.length;
      this.fileName = [];
      for (var i in files) {
        console.log(i, ":", files[i]);
        if (i == "length") {
          return false;
        } else if (!/\.(kml|KML)$/.test(files[i].name)) {
          alert("图片类型必须是kml文件");
          return false;
        } else {
          this.uploadImgToQiniu(files[i]);
        }
      }
    },
    //上传图片到七牛
    uploadImgToQiniu(file) {
      const axiosInstance = axios.create({ withCredentials: false }); //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
      let data = new FormData();
      data.append("token", this.res.uptoken); //七牛需要的token，叫后台给，是七牛账号密码等组成的hash
      data.append("file", file);
      axiosInstance({
        method: "POST",
        url: "http://upload-z2.qiniup.com", //上传地址
        data: data,
        timeout: 30000, //超时时间，因为图片上传有可能需要很久
        onUploadProgress: progressEvent => {
          //imgLoadPercent 是上传进度，可以用来添加进度条
          let imgLoadPercent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      })
        .then(data => {
          console.log("data.key", data.data.key);
          document.getElementById("uploadFileInput").value = ""; //上传成功，把input的value设置为空，不然 无法两次选择同一张图片
          //上传成功...  (登录七牛账号，找到七牛给你的 URL地址) 和 data里面的key 拼接成图片下载地址
          this.fileName.push(data.data.key);
          console.log("fileName", this.fileName);
          if (this.fileName.length == this.fileLength) {
            eventBus.$emit("kmlUpload",  this.fileName);
          }
        })
        .catch(function(err) {
          //上传失败
        });
    }
  }
};
</script>

<style>
</style>
