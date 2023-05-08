import { motion } from 'framer-motion';

export function Text({ children }: { children: React.ReactNode }) {
	return (
		<motion.p
			className="absolute w-1/3 left-[calc(40%*1.5)] p-4 bg-gray-800 bg-opacity-60 rounded-xl"
			initial={{ opacity: 0, x: '50vw', filter: 'blur(10px)' }}
			animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
			exit={{ opacity: 0, x: '50vw', filter: 'blur(10px)' }}
			transition={{ duration: 1 }}
		>
			{children}
		</motion.p>
	);
}
