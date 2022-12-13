<template>
  <div>
    <!--    添加按钮-->
    <el-button type="primary" icon="el-icon-plus" style="margin-top: 20px" @click="dialogVisible=true">添加</el-button>

    <!--    品牌表格-->
    <el-table
      :data="tradeMarkList"
      stripe
      border
      height="456"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column align="center" width="100px" type="index" label="序号"></el-table-column>
      <el-table-column align="center" prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column align="center" label="品牌logo">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" height="50px" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="dialogVisible=true">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    分页器-->
    <el-pagination
      layout="prev, pager, next, jumper, ->, sizes, total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5, 10]"
      :pager-count="5"
      :total="total"
      style="text-align: center; margin-top: 20px"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>



<!--    添加品牌的弹框-->
    <el-dialog
      title="添加品牌"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form :model="addTradeMarkForm">
        <el-form-item label="品牌名称" required>
          <el-input v-model="addTradeMarkForm.tmName" placeholder="请输入品牌名称" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" required>
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="addTradeMarkForm.logoUrl" :src="addTradeMarkForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip" style="margin-left: 80px;">只能上传jpg文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary">提交</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TraderMark",
  data() {
    return {
      // 当前页码
      page: 1,
      // 每页显示数据条数
      limit: 5,
      // 数据总数
      total: 0,
      // 品牌列表数组
      tradeMarkList: [],

      // 控制是否显示添加品牌的弹框
      dialogVisible: false,
      // 添加品牌的数据
      addTradeMarkForm: {
        tmName: '',
        logoUrl: ''
      }
    };
  },

  methods: {
    // 获取品牌列表
    async getTradeMarkListByPage() {
      // 解构出页码和每页显示的数据条数
      const { page, limit } = this;
      // 调用获取品牌数据的接口
      const result = await this.$api.tradeMark.getTradeMarkList(page, limit);
      if (result.code === 200) {
        this.tradeMarkList = result.data.records;
        this.total = result.data.total;
      }
    },

    /*
      分页器相关事件
     */
    // 当前页码改变的事件
    handleCurrentChange(page) {
      this.page = page;
      this.getTradeMarkListByPage();
    },
    // 每页显示的数据条数改变的事件
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTradeMarkListByPage();
    },


    /*
      上传品牌logo相关事件
     */
    // 上传成功事件
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.addTradeMarkForm.logoUrl = URL.createObjectURL(file.raw);
    },
    // 上传之前的事件
    beforeAvatarUpload(file) {
      // 判断图片格式
      const isJPG = file.type === 'image/jpeg';
      // 判断图片是否小于2MB
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },

  mounted() {
    // 获取品牌列表数据
    this.getTradeMarkListByPage();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
