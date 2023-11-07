import Router from "next/router";


export const redirectUser = (ctx, location) => {
    if (ctx.req) {
        //if the user is on server side, since req and res inside ctx object are pressent only on server side
        ctx.res.writeHead(302, { Location: location });
        ctx.res.end();
    } else {
        //if the user is on client side
        Router.push(location);
    }
};
