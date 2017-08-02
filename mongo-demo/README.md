## mongo-shell

> show databases
> user xxx
> show collections
yyy
> db.yyy.find()

iife前加分号 [ ( + - /


UserSchema.index({ name: 1 }, { unique: true }) // 创建唯一索引
// UserSchema.index({ name: 1, age: 1 }) // 混合索引，1正序，-1倒序，空间换时间

非常快-非常慢
内存->遍历文档

非常快-比较快-  比较快
内存->寻找索引->根据索引取文档 

只取name和age
内存->寻找索引

稀疏索引，不一定要有值，效率低一点
sparseIndex

in_memory 缓存内存数据库

LRU 最近访问的多少个在缓存内

geoIndex 地理位置索引


Schema.Types.ObjectId 只取model类型里的ObjectId