module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0, // 函数前不要空格
    'space-before-blocks': 0,
    'keyword-spacing': 0,
    'semi': 0, //关闭句尾以省略号结尾
    'singleQuote': true, // 单引号,
    'vue/no-unused-vars': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
