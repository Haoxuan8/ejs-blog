
module.exports = {
    app: {
        title: "Blog",
        version: "1.0.0",
        navbarMenu: [
            { path:'/', display: true, icon: 'fas fa-store-alt', title: '首页' },
            { path:'/archive', display: true, icon: 'fas fa-inbox', title: '归档' },
            { path:'/tags', display: true, icon: 'fas fa-tags', title: '标签' },
            { path:'/friends', display: true, icon: 'fas fa-link', title: '友人' },
            { path:'/about', display: true, icon: 'fas fa-leaf', title: '关于' }
         ],
         eachPageShow: 6,
    },
    
    tagsColor: [
        '#B28FCE', // 薄
        '#86C166', // 苗
        '#F596AA', // 桃
        '#F19483', // 曙
        '#F9BF45', // 玉子
        '#FAD689', // 浅黄
        '#E79460', // 洗柿
        '#2EA9DF', // 露草
        '#FB966E', // 洗朱
        '#BC9F77', // 白茶
        '#867835', // 黄海松茶
        '#B9887D' // 水がき
      ],

    secret: "Happy happy every day!",

    port: 8080,

    database: {
        url: ""
    }
};