import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 弹框组件挂载到vue原型对象上，每个组件都可以使用 this.$message 进行使用
Vue.prototype.$message = Message
