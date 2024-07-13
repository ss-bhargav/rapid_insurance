import { AnimatePresence, motion } from "framer-motion";
import { routeAnimation, fadeIn } from "../../helper/animation";

const RouteAnimation = ({ children }) => {
    return (
        <AnimatePresence exitBeforeEnter>
            <motion.div {...routeAnimation}>
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default RouteAnimation;
