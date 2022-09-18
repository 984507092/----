import { gettingData as http} from '@/utils/orderRequest.js'

//创建订单  
export const  checkOrder=(params)=>http({url:'/order/checkOrder',data:params,method:'POST'})

// 提交订单  
export const  submitOrder=(params)=>http({url:'/order/submitOrder',data:params,method:'POST'})

// 获取地址列表  
export const  getAddrList=(params)=>http({url:'/order/getAddrList',data:params,method:'POST'})

// 设置默认收货地址
export const  setDefaultAddr=(params)=>http({url:'/order/set_default_addr',data:params,method:'POST'})

// 保存收货地址信息   
export const  saveAddress=(params)=>http({url:'/order/saveAddress',data:params,method:'POST'})

// 删除地址  
export const  delAddr=(params)=>http({url:'/order/del_addr',data:params,method:'POST'})

// 获取地址详情   
export const  getAddrDetail=(params)=>http({url:'/order/get_addr_detail',data:params,method:'POST'})

//  获取默认收货地址   
export const  getDefaultAddr=(params)=>http({url:'/order/get_default_addr',data:params,method:'POST'})

// 获取支付订单  /order/payOrder
export const  payOrder=(params)=>http({url:'/order/payOrder',data:params,method:'POST'})

//查询订单  
export const  queryOrder=(params)=>http({url:'/order/query_order',data:params,method:'POST'})

// 订单列表  
export const  getOrderList=(params)=>http({url:'/order/getOrderList',data:params,method:'POST'})

// 订单详情  
export const  getOrderDetail=(params)=>http({url:'/order/getOrderDetail',data:params,method:'POST'})

// 取消订单  
export const  cancelOrder=(params)=>http({url:'/order/cancel_order',data:params,method:'POST'})