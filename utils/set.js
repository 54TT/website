import Router from "next/router";
import {gql} from "graphql-tag";
import {ApolloClient, InMemoryCache} from "@apollo/client";
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


export const dao = (name) => {
    if (name) {
        var day = Math.floor((name / (24 * 3600)))
        var hour = Math.floor((name - (24 * 3600 * day)) / (3600))
        var min = Math.floor((name - (24 * 3600 * day) - (hour * 3600)) / (60))
        var sin=Math.floor(name-(24*3600*day)-(hour*3600)-(min*60))
        const m = min.toString().length === 1 ? '0' + min : min
        // const d = day.toString().length === 1 ? '0' + day : day
        const h = hour.toString().length === 1 ? '0' + hour : hour
        const s = sin.toString().length === 1 ? '0' + sin : sin
        if(day){
            const data = Number(hour)+day*24
            return   data + ':' + m+':'+s
        }else {
            return  h + ':' + m+':'+s
        }
    } else {
        return '00:00:00'
    }
}


export const autoConvert = (number) => {
    if (Math.abs(number) >= 1000000) {
        return `${(number / 1000000).toFixed(4).replace(/\.?0*$/, '')}M`;
    } else if (Math.abs(number) >= 1000) {
        return `${(number / 1000).toFixed(4).replace(/\.?0*$/, '')}K`;
    } else {
        return number.toFixed(4).replace(/\.?0*$/, '');
    }

};

export const autoConvertNew = (number) => {
    if (Math.abs(number) >= 1000000) {
        return `${(number / 1000000).toFixed(4).replace(/\.?0*$/, '')}M`;
    } else {
        return number.toFixed(4).replace(/\.?0*$/, '');
    }
};

export const arrayUnique = (arr, name) => {
    var hash = {}
    return arr.reduce(function (acc, cru, index) {
        if (!hash[cru[name]]) {
            hash[cru[name]] = {index: index}
            acc.push(cru)
        } else {
            acc.splice(hash[cru[name]]['index'], 1, cru)
        }
        return acc
    }, [])
}

