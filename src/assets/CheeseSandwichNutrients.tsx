import { motion } from 'framer-motion';

export function CheeseSandwichNutrients({ list }: { list: string[] }) {
	return (
		<motion.div
			className="flex flex-col absolute text-center text-[3.5vh] w-1/2 left-[calc(30%*1.5)]"
			variants={{
				visible: {
					transition: {
						delayChildren: 0.5,
						staggerChildren: 0.1,
					},
				},
				hidden: {
					transition: {
						staggerChildren: 0,
					},
				},
			}}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			{list.map((item, index) => (
				<motion.p
					key={index}
					className={index === 0 ? 'text-[4vh] text-blue-500' : ''}
					variants={{
						visible: {
							opacity: 1,
							x: 0,
							filter: 'blur(0px)',
							transition: {
								duration: 1,
								ease: 'easeInOut',
							},
						},
						hidden: {
							opacity: 0,
							x: '50vw',
							filter: 'blur(10px)',
							transition: {
								duration: 1,
							},
						},
					}}
				>
					{item}
				</motion.p>
			))}
		</motion.div>
	);
}
