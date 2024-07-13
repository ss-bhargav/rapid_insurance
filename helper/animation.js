

export const fadeIn = {
    variants: {
        from: {
            opacity: 0,
            height: 0,
        },
        to: {
            opacity: 1,
            height: "initial",
            transition: { type: "spring", stiffness: 100 }
        },
        exit: {
            opacity: 1,
            height: "initial",
            transition: {
                delay: 0.1,
                ease: "easeInOut",
            }
        }
    },
    initial: "from",
    animate: "to",
    exit: "exit",
}

export const routeAnimation = {
    variants: {
        from: {
            opacity: 0,
            right: "-50px"
        },
        to: {
            opacity: 1,
            right: "10px",
            transition: { type: "spring", stiffness: 100 }
        },
        exit: {
            opacity: 0,
            transition: {
                delay: 0.1,
                ease: "easeInOut",
            }
        }
    },
    initial: "from",
    animate: "to",
    exit: "exit"
}