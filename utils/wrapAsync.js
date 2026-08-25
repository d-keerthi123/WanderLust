module.exports=(fu)=>{
    return (res,req,next)=>{
        fn(res,req,next).catch(next);
    }
}