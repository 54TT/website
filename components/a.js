export  function getScrollYAnimation() {
    return ({
        offscreen: {
            y: 250,
            opacity: 0,
        },
        onscreen: ({duration = 2} = {}) =>  ({
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                duration,
            }
        })
    })
}
export  function getScrollXAnimation() {
    return ({
        offscreen: {
            x: 250,
            opacity: 0,
        },
        onscreen: ({duration = 2} = {}) =>  ({
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                duration,
            }
        })
    })
}

export  function getScrollXXAnimation() {
    return ({
        offscreen: {
            x: -250,
            opacity: 0,
        },
        onscreen: ({duration = 2} = {}) =>  ({
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                duration,
            }
        })
    })
}