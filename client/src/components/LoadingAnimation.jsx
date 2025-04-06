import { motion } from 'framer-motion';

const variants = {
  container: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  },
  item: {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  },
  pulse: {
    initial: { opacity: 0.5, scale: 1 },
    animate: { 
      opacity: [0.5, 1, 0.5], 
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

const LoadingAnimation = ({ 
  text = "Loading...", 
  subText = "",
  size = "medium",
  type = "pulse" // "pulse", "dots", "spinner"
}) => {
  const sizes = {
    small: {
      container: "w-12 h-12",
      text: "text-sm mt-2",
      subText: "text-xs"
    },
    medium: {
      container: "w-16 h-16",
      text: "text-base mt-3",
      subText: "text-sm"
    },
    large: {
      container: "w-24 h-24",
      text: "text-lg mt-4",
      subText: "text-base"
    }
  };

  const renderLoadingType = () => {
    switch(type) {
      case "dots":
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  y: [0, -6, 0]
                }}
                transition={{
                  duration: 1, 
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );
      
      case "spinner":
        return (
          <div className="relative">
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-b-white"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                ease: "linear",
                repeat: Infinity
              }}
            />
            <div className={`${sizes[size].container} rounded-full bg-white/5`} />
          </div>
        );
        
      case "pulse":
      default:
        return (
          <div className="relative">
            <motion.div 
              className="absolute inset-0 rounded-full bg-purple-600/20"
              variants={variants.pulse}
              initial="initial"
              animate="animate"
            />
            <motion.div 
              className="absolute inset-0 rounded-full bg-blue-600/20"
              variants={variants.pulse}
              initial="initial"
              animate="animate"
              transition={{
                delay: 0.5
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      variants={variants.container}
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className={`relative ${sizes[size].container}`}
        variants={variants.item}
      >
        {renderLoadingType()}
      </motion.div>
      
      {text && (
        <motion.p 
          className={`text-white ${sizes[size].text}`}
          variants={variants.item}
        >
          {text}
        </motion.p>
      )}
      
      {subText && (
        <motion.p 
          className={`text-white/60 ${sizes[size].subText}`}
          variants={variants.item}
        >
          {subText}
        </motion.p>
      )}
    </motion.div>
  );
};

export default LoadingAnimation; 