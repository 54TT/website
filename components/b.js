import React, {useMemo} from 'react';
import ScrollAnimationWrapper from "./demo";
import {motion} from "framer-motion";
import {getScrollXAnimation, getScrollXXAnimation, getScrollYAnimation} from "./a";


function B({children,name}) {
    const scrollRightAnimation = useMemo(() => getScrollXXAnimation(), []);
    const scrollLeftAnimation = useMemo(() => getScrollXAnimation(), []);
    const scrollTopAnimation = useMemo(() => getScrollYAnimation(), []);
    return (
        <ScrollAnimationWrapper>
            <motion.div variants={name==='left'?scrollLeftAnimation:name==='right'?scrollRightAnimation:scrollTopAnimation}>
                {children}
            </motion.div>
        </ScrollAnimationWrapper>
    );
}

export default B;