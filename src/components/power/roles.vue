<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id" :class="['bdbottom', index1 === 0 ? 'bdtop' : '']" class="v_center">
              <!-- 一级 -->
              <el-col :span="5">
                <el-tag type="primary" closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级  -->
              <el-col :span="19">
                <el-row  v-for="(item2, index2) in item1.children" :key="item2.id" :class="[index2 === 0 ? '' : 'bdtop']" class="v_center">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag type="warning" closable @close="removeRightById(scope.row, item3.id)" v-for="(item3, index3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="handleAllot(scope.row.id)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      @close="addRolesDialogClosed"
      width="50%"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesDialogVisible" width="50%" @close="editRolesDialogClosed">
      <el-form
        :model="editRolesForm"
        :rules="editRolesFormRules"
        ref="editRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRolesDialogVisible: false,
      editRolesDialogVisible: false,
      addRolesForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      editRolesForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      },
      editRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    },
    addRolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
    },
    addRoles() {
      // 需要进行预验证
      this.$refs.addRolesFormRef.validate(async valid => {
        // console.log(valid)
        // 未通过
        if (!valid) return
        // 通过
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('创建角色失败')
        }
        this.$message.success('创建角色成功')
        this.addRolesDialogVisible = false
        this.getRolesList()
      })
    },
    editRolesDialogClosed(){
      this.$refs.editRolesFormRef.resetFields()
    },
    async handleEdit(id) {
      // console.log(id)
      this.editRolesDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      // this.$message.success('获取角色信息成功')
      this.editRolesForm = res.data
      // this.editRolesDialogVisible = false
    },
    editRoles() {
      this.$refs.editRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `roles/${this.editRolesForm.roleId}`,
          {
            roleDesc: this.editRolesForm.roleDesc,
            roleName: this.editRolesForm.roleName
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色信息失败')
        }
        this.$message.success('编辑角色信息成功')
        this.editRolesDialogVisible = false
        this.getRolesList()
      })
    },
    async handleDelete(id) {
      // console.log(id)
      const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch(err => err)
      // console.log(confirmRes);

      if(confirmRes !== 'confirm'){
        return this.$message.info('取消删除')
      }

      const { data: res } = await this.$http.delete(`roles/${id}`)
      if(res.meta.status !== 200){
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    async removeRightById(role, rightId) {
      // console.log(role, rightId)
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmRes)
      if(confirmRes !== 'confirm'){
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // this.getRolesList() 面板会折叠
      // 此处的role 是前面的scope.row 即每行数据 rolesList 中的每行的数据
      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.v_center{
  display: flex;
  align-items: center;
}
</style>
