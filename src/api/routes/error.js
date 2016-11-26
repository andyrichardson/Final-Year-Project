const errorHandler = function(err, req, res, next){
    if(process.env.NODE_ENV == 'development'){
        console.log(err);
    }
    
    const error = {
        message: err.message,
        status: err.status
    };

    // Validation errors
    if(error.message.includes('Validation')){
        error.status = 400;
    }

    // Other errors
    switch (error.message) {
        case "Not found":
            error.status = 404;
            break;

        default:
            if(error.status === undefined){
                error.status = 500;
            }
            break;
    }



    res.status(error.status);
    res.json(error);
};

module.exports = errorHandler;
