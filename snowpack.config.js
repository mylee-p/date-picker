module.exports ={
  mount:{
      public: {url: '/', static: true}, // '/' : 최상위
      src:{url:'/dist'}
  },
  optimize:{
      minify:true //
  },
  plugins:[
      '@snowpack/plugin-sass' //설치한 플러그인을 string으로 넣어준다.
  ]
}