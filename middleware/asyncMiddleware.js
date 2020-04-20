function asyncMiddleware(handler) {
    console.log('--- returning aynscMiddlewareWrapper function ---');
    return async (request, response, next) => {
        console.log('--- Express.JS function innovation of asyncMiddlewareWrapper ---');
        try {   
            console.log('--- Express.JS function innovation of handler ---');
            await handler(request, response);
        }  catch(error) {
            next(error);
        }
    }
}

module.exports = asyncMiddleware;