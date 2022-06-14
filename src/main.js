import Vue from 'vue'
import App from './App.vue'
// import store from './store'
import {
  Table,
  TableColumn,
  Form,
  FormItem,
  Message,
  Button,
  Input,
  Row,
  Col,
  Notification,
  Alert,
  Menu,
  MenuItem,
  Link,
} from 'element-ui'
// import axios from 'axios'

Vue.config.productionTip = false
// Vue.prototype.axios = axios
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Alert)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Link)
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification


new Vue({
  // store,
  render: h => h(App)
}).$mount('#app')