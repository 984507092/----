import { gettingData as http} from '@/utils/request.js'

// 获取banner
export const getBanner=(params)=>http({url:'/api/get_banner',data:params,method:'POST'})

// 获取分类
export const  getCate=(params)=>http({url:'/api/get_cate',data:params,method:'POST'})

// 获取精选  
export const  getCompetitive=(params)=>http({url:'/api/get_competitive',data:params,method:'POST'})

// 猜你喜欢  
export const  getLike=(params)=>http({url:'/api/get_like',data:params,method:'POST'})

// 获取搜索列表  
export const  getSearchList=(params)=>http({url:'/api/get_search_list',data:params,method:'POST'})

// 获取文章列表   
export const  getArticleList=(params)=>http({url:'/api/get_article_list',data:params,method:'POST'})

//获取文章详情  
export const  getArticle=(params)=>http({url:'/api/get_article',data:params,method:'POST'})