import { AnimatePresence, motion, useAnimate, useSpring } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import './App.css';
import { CheeseSandwich } from './assets/CheeseSandwich';
import { CheeseSandwichNutrients } from './assets/CheeseSandwichNutrients';
import { Text } from './assets/Text';

const minimumDisplayDifference = 267;
const totalSteps = 26;
let epiglottisOpen = false;
let epiglottisInterval: number;
function App() {
	const particlesInit = useCallback(loadFull, []);

	const [disableDisplay, setDisableDisplay] = useState(
		window.innerWidth - window.innerHeight < minimumDisplayDifference,
	);
	const [progress, setProgress] = useState(0);
	const springProgress = useSpring(0, { stiffness: 50, damping: 20 });
	const [mainImage, animateMainImage] = useAnimate();
	const [sandwich, animateSandwich] = useAnimate();
	const [food, animateFood] = useAnimate();
	const [step, setStep] = useState(0);

	const [sandwichRotate, setSandwichRotate] = useState(false);
	const [sandwichStep, setSandwichStep] = useState(0);

	// Loop Animations
	const [epiglottis, animateEpiglottis] = useAnimate();

	const bodyColors = {
		body: '#ffe6d0',
		liver: '#b21416',
		pancreas: '#f7931e',
		small_intestine: '#FF4C4F',
		epiglottis: '#4fcf2b',
		esophagus: '#FF4C4F',
		stomach: '#FF4C4F',
		gallbladder: '#006054',
		tongue: '#BF2B45',
		salivary_glands: '#F7931E',
		large_intestine: '#BF2B45',
		rectum: '#BF2B45',
		anus: '#BF2B45',
		mainImageText: '#d937e2',
		mainImageTextStroke: '#29c9d0',
	};

	const [bodyOpacities, setBodyOpacities] = useState({
		liver: 1,
		pancreas: 1,
		small_intestine_1: 1,
		small_intestine_2: 1,
		small_intestine_3: 1,
		epiglottis: 1,
		esophagus: 1,
		stomach: 1,
		gallbladder: 1,
		tongue: 1,
		salivary_glands: 1,
		large_intestine: 1,
		rectum: 1,
		anus: 1,
	});
	const [showText, setShowText] = useState(true);

	useEffect(
		() =>
			window.addEventListener('resize', () =>
				setDisableDisplay(window.innerWidth - window.innerHeight < minimumDisplayDifference),
			),
		[],
	);

	useEffect(() => setProgress(step / totalSteps), [step]);
	useEffect(() => springProgress.set(progress), [springProgress, progress]);

	useEffect(() => {
		document.addEventListener('keydown', (event) => {
			const forward =
				event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter'
					? true
					: event.key === 'ArrowLeft'
					? false
					: null;
			if (forward === null) return;

			setStep((step) => (forward ? Math.min(totalSteps, step + 1) : Math.max(0, step - 1)));
		});
	}, []);

	// MainImage Custom Animations
	useEffect(() => {
		if (!mainImage.current) return;
		const hideMainImageSteps = [0, 3, 4, 5];
		animateMainImage(
			mainImage.current,
			hideMainImageSteps.includes(step)
				? {
						opacity: 0,
						filter: 'blur(10px)',
						right: '50vw',
						top: '0',
						scale: 1,
				  }
				: {
						opacity: 1,
						filter: 'blur(0px)',
				  },
			{ duration: 1, ease: 'easeInOut' },
		);
		switch (step) {
			case totalSteps:
			case 1:
				animateMainImage(mainImage.current, { right: '20vw', top: '0', scale: 1 }, { duration: 1, ease: 'easeInOut' });
				animateFood(food.current, { opacity: 0 }, { duration: 1, ease: 'easeInOut' });
				setShowText(true);
				break;
			case 2:
				animateMainImage(
					mainImage.current,
					{ right: '30vw', top: '100%', scale: 3 },
					{ duration: 1, ease: 'easeInOut' },
				);
				setShowText(false);
				break;
			case 6:
				animateMainImage(
					mainImage.current,
					{ right: '30vw', top: '100%', scale: 3 },
					{ duration: 1, ease: 'easeInOut' },
				);
				break;
			case 7:
				focusObject(false);
				animateMainImage(
					mainImage.current,
					{ right: '60vw', top: '300%', scale: 10 },
					{ duration: 1, ease: 'easeInOut' },
				);
				break;
			case 8:
				focusObject('salivary_glands');
				animateMainImage(
					mainImage.current,
					{ right: '20vw', top: '330%', scale: 10 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { opacity: 0 }, { duration: 1, ease: 'easeInOut' });
				break;
			case 9:
				focusObject('tongue');
				animateMainImage(
					mainImage.current,
					{ right: '60vw', top: '260%', scale: 9 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -12.5, y: 3 }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { opacity: 1, x: 0, y: 0 }, { duration: 1, ease: 'easeInOut' }),
				);
				clearInterval(epiglottisInterval);
				if (epiglottisOpen) animateEpiglottis(epiglottis.current, { rotateZ: 0 });
				break;
			case 10:
				focusObject('epiglottis');
				animateMainImage(
					mainImage.current,
					{ right: '10vw', top: '230%', scale: 9 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -12.5, y: 3 }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: -12.5, y: 10 }, { duration: 1, ease: 'easeInOut' }),
				);
				epiglottisInterval = setInterval(() => {
					animateEpiglottis(epiglottis.current, {
						rotateZ: epiglottisOpen ? 0 : -90,
					});
					epiglottisOpen = !epiglottisOpen;
				}, 1000);
				break;
			case 11:
				focusObject('esophagus');
				animateMainImage(
					mainImage.current,
					{ right: '10vw', top: '130%', scale: 9 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -12.2, y: 60 }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: -12.2, y: 60 }, { duration: 1, ease: 'easeInOut' }),
				);
				clearInterval(epiglottisInterval);
				if (epiglottisOpen) animateEpiglottis(epiglottis.current, { rotateZ: 0 });
				break;
			case 12:
				focusObject(true);
				animateMainImage(
					mainImage.current,
					{ right: '10vw', top: '220%', scale: 15 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -12.2, y: 60 }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: -12.2, y: 60 }, { duration: 1, ease: 'easeInOut' }),
				);
				break;
			case 13:
				focusObject('stomach');
				animateMainImage(
					mainImage.current,
					{ right: '35vw', top: '-50%', scale: 8 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -12.2, y: 130 }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: -5, y: 150 }, { duration: 1, ease: 'easeInOut' }),
				);
				break;
			case 14:
				focusObject('liver');
				animateMainImage(
					mainImage.current,
					{ right: '5vw', top: '-40%', scale: 6 },
					{ duration: 1, ease: 'easeInOut' },
				);
				break;
			case 15:
				focusObject('gallbladder');
				animateMainImage(
					mainImage.current,
					{ right: '-30vw', top: '-80%', scale: 10 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(
					food.current,
					{ x: -13, y: 170, scale: 0.6, fill: '#fbff00' },
					{ duration: 1, ease: 'easeInOut' },
				).then(() => animateFood(food.current, { x: -5, y: 150, scale: 0.6 }, { duration: 1, ease: 'easeInOut' }));
				break;
			case 16:
				focusObject('pancreas');
				animateMainImage(
					mainImage.current,
					{ right: '10vw', top: '-100%', scale: 10 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(
					food.current,
					{ x: -13, y: 170, scale: 0.6, fill: '#7a921d' },
					{ duration: 1, ease: 'easeInOut' },
				).then(() => animateFood(food.current, { x: -5, y: 150, scale: 0.6 }, { duration: 1, ease: 'easeInOut' }));
				break;
			case 17:
				focusObject(true);
				animateMainImage(
					mainImage.current,
					{ right: '10vw', top: '-200%', scale: 15 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -13, y: 170, scale: 0.6 }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: -18, y: 175, scale: 0.6 }, { duration: 1, ease: 'easeInOut' }),
				);
				break;
			case 18:
				focusObject(['small_intestine_1', 'small_intestine_2', 'small_intestine_3']);
				animateMainImage(
					mainImage.current,
					{ right: '5vw', top: '-110%', scale: 6 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -25, y: 180, scale: 0.6 }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: -25, y: 180, scale: 0.6 }, { duration: 1, ease: 'easeInOut' }),
				);
				break;
			case 19:
				focusObject('small_intestine_1');
				animateMainImage(
					mainImage.current,
					{ right: '-5vw', top: '-150%', scale: 10 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(
					food.current,
					{ x: -42, y: 185, scale: 0.5, fill: '#7a921d' },
					{ duration: 1, ease: 'easeInOut' },
				).then(() =>
					animateFood(
						food.current,
						{ x: -46, y: 194, scale: 0.5, fill: '#7a921d' },
						{ duration: 1, ease: 'easeInOut' },
					),
				);
				break;
			case 20:
				focusObject('small_intestine_2');
				animateMainImage(
					mainImage.current,
					{ right: '15vw', top: '-140%', scale: 8 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -42, y: 198, fill: '#7b7c0d' }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: -35, y: 190, fill: '#7b7c0d' }, { duration: 1, ease: 'easeInOut' }).then(() =>
						animateFood(food.current, { x: -28, y: 198, fill: '#7b7c0d' }, { duration: 1, ease: 'easeInOut' }).then(
							() =>
								animateFood(food.current, { x: -21, y: 190, fill: '#7b7c0d' }, { duration: 1, ease: 'easeInOut' }).then(
									() =>
										animateFood(
											food.current,
											{ x: -14, y: 198, fill: '#7b7c0d' },
											{ duration: 1, ease: 'easeInOut' },
										).then(() =>
											animateFood(
												food.current,
												{ x: -5, y: 188, fill: '#7b7c0d' },
												{ duration: 1, ease: 'easeInOut' },
											).then(() =>
												animateFood(
													food.current,
													{ x: 3, y: 196, fill: '#7b7c0d' },
													{ duration: 1, ease: 'easeInOut' },
												).then(() =>
													animateFood(
														food.current,
														{ x: 14, y: 186, fill: '#7b7c0d' },
														{ duration: 1, ease: 'easeInOut' },
													).then(() =>
														animateFood(
															food.current,
															{ x: 14, y: 194, fill: '#7b7c0d' },
															{ duration: 1, ease: 'easeInOut' },
														),
													),
												),
											),
										),
								),
						),
					),
				);
				break;
			case 21:
				focusObject('small_intestine_3');
				animateMainImage(
					mainImage.current,
					{ right: '15vw', top: '-160%', scale: 8 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: 20, y: 202, fill: '#454600' }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: 8, y: 201, fill: '#454600' }, { duration: 1, ease: 'easeInOut' }).then(() =>
						animateFood(food.current, { x: 4, y: 210, fill: '#454600' }, { duration: 1, ease: 'easeInOut' }).then(() =>
							animateFood(food.current, { x: -4, y: 201, fill: '#454600' }, { duration: 1, ease: 'easeInOut' }).then(
								() =>
									animateFood(
										food.current,
										{ x: -12, y: 214, fill: '#454600' },
										{ duration: 1, ease: 'easeInOut' },
									).then(() =>
										animateFood(
											food.current,
											{ x: -20, y: 204, fill: '#454600' },
											{ duration: 1, ease: 'easeInOut' },
										).then(() =>
											animateFood(
												food.current,
												{ x: -28, y: 212, fill: '#454600' },
												{ duration: 1, ease: 'easeInOut' },
											).then(() =>
												animateFood(
													food.current,
													{ x: -34, y: 204, fill: '#454600' },
													{ duration: 1, ease: 'easeInOut' },
												).then(() =>
													animateFood(
														food.current,
														{ x: -42, y: 212, fill: '#454600' },
														{ duration: 1, ease: 'easeInOut' },
													).then(() =>
														animateFood(
															food.current,
															{ x: -48, y: 212, fill: '#454600' },
															{ duration: 1, ease: 'easeInOut' },
														),
													),
												),
											),
										),
									),
							),
						),
					),
				);
				break;
			case 22:
				focusObject('large_intestine');
				animateMainImage(
					mainImage.current,
					{ right: '20vw', top: '-70%', scale: 4 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -56, y: 212 }, { duration: 1, ease: 'easeInOut' }).then(() =>
					animateFood(food.current, { x: -56, y: 180 }, { duration: 1, ease: 'easeInOut' }).then(() =>
						animateFood(food.current, { x: 25, y: 180 }, { duration: 1, ease: 'easeInOut' }).then(() =>
							animateFood(food.current, { x: 25, y: 210 }, { duration: 1, ease: 'easeInOut' }).then(() =>
								animateFood(food.current, { x: -14, y: 230 }, { duration: 1, ease: 'easeInOut' }),
							),
						),
					),
				);
				break;
			case 23:
				focusObject(true);
				animateMainImage(
					mainImage.current,
					{ right: '20vw', top: '-900%', scale: 30 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(
					food.current,
					{ x: -14, y: 245, scale: 0.5, fill: '#535641' },
					{ duration: 1, ease: 'easeInOut' },
				).then(() =>
					animateFood(
						food.current,
						{ x: -14, y: 245, scale: 0.5, fill: '#535641' },
						{ duration: 1, ease: 'easeInOut' },
					).then(() =>
						animateFood(
							food.current,
							{ x: -14, y: 245, scale: 0.5, fill: '#535641' },
							{ duration: 1, ease: 'easeInOut' },
						).then(() =>
							animateFood(
								food.current,
								{ x: -14, y: 245, scale: 0.5, fill: '#535641' },
								{ duration: 1, ease: 'easeInOut' },
							).then(() =>
								animateFood(
									food.current,
									{ x: -14, y: 245, scale: 0.5, fill: '#535641' },
									{ duration: 1, ease: 'easeInOut' },
								).then(() =>
									animateFood(
										food.current,
										{ x: -14, y: 245, scale: 0.5, fill: '#535641' },
										{ duration: 1, ease: 'easeInOut' },
									),
								),
							),
						),
					),
				);
				break;
			case 24:
				focusObject('rectum');
				animateMainImage(
					mainImage.current,
					{ right: '20vw', top: '-300%', scale: 10 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -14, y: 245, scale: 0.5 }, { duration: 1, ease: 'easeInOut' });
				break;
			case 25:
				focusObject('anus');
				animateMainImage(
					mainImage.current,
					{ right: '20vw', top: '-620%', scale: 20 },
					{ duration: 1, ease: 'easeInOut' },
				);
				animateFood(food.current, { x: -14, y: 255, scale: 0.2, opacity: 1 }, { duration: 1, ease: 'easeInOut' });
				setShowText(false);
				break;
		}

		function focusObject(object: keyof typeof bodyOpacities | (keyof typeof bodyOpacities)[] | boolean) {
			if (!object || object === true)
				return setBodyOpacities(
					(bodyOpacities) =>
						Object.keys(bodyOpacities).reduce((accumulator, key) => {
							return { ...accumulator, [key]: object ? 0.3 : 1 };
						}, {}) as typeof bodyOpacities,
				);
			setBodyOpacities(
				(bodyOpacities) =>
					Object.fromEntries(
						Object.entries(bodyOpacities).map(([key]) => [
							key,
							key === object || object.includes(key as keyof typeof bodyOpacities) ? 1 : 0.3,
						]),
					) as typeof bodyOpacities,
			);
		}
	}, [step, mainImage, animateMainImage, epiglottis, animateEpiglottis, food, animateFood]);

	// Sandwich Custom Animations
	useEffect(() => {
		if (!sandwich.current) return;
		const showSandwichSteps = [2, 3, 4, 5, 6];
		animateSandwich(
			sandwich.current,
			showSandwichSteps.includes(step)
				? {
						opacity: 1,
						filter: 'blur(0px)',
				  }
				: {
						opacity: 0,
						filter: 'blur(10px)',
						top: '-100%',
				  },
			{ duration: 1 },
		);
		switch (step) {
			case 2:
				setSandwichRotate(false);
				animateSandwich(sandwich.current, { left: '20vw', top: '10%', scale: 1 }, { duration: 1, ease: 'easeInOut' });
				break;
			case 3:
				setSandwichRotate(true);
				setSandwichStep(0);
				animateSandwich(
					sandwich.current,
					{ left: '-10vw', top: '30%', scale: 1.5 },
					{ duration: 1, ease: 'easeInOut' },
				);
				break;
			case 4:
				setSandwichStep(1);
				break;
			case 5:
				setSandwichRotate(true);
				setSandwichStep(2);
				animateSandwich(
					sandwich.current,
					{ left: '-10vw', top: '30%', scale: 1.5 },
					{ duration: 1, ease: 'easeInOut' },
				);
				break;
			case 6:
				setSandwichRotate(false);
				setSandwichStep(3);
				animateSandwich(sandwich.current, { left: '23vw', top: '10%', scale: 1 }, { duration: 1, ease: 'easeInOut' });
				break;
			case 7:
				setSandwichRotate(false);
				setSandwichStep(4);
				animateSandwich(sandwich.current, { left: '10vw', top: '10%', scale: 1 }, { duration: 1, ease: 'easeInOut' });
				break;
		}
	}, [step, sandwich, animateSandwich]);

	return (
		<div className="flex flex-row bg-gray-800 h-full w-full">
			{disableDisplay && (
				<div className="fixed flex justify-center items-center text-center h-full w-full bg-gray-800 z-50">
					<h1 className="text-5xl text-white">Please rotate your device / Your display is not supported</h1>
				</div>
			)}
			<motion.div
				className="fixed top-0 left-0 right-0 h-2 bg-blue-400 origin-[0] z-50"
				style={{ scaleX: springProgress }}
			/>
			<AnimatePresence mode="popLayout">
				{step === 0 && (
					<motion.div
						key="0"
						className="absolute flex justify-center items-center h-full w-full"
						initial={{
							opacity: 0,
							y: -100,
							filter: 'blur(10px)',
						}}
						animate={{
							opacity: 1,
							y: 0,
							filter: 'blur(0px)',
						}}
						transition={{
							duration: 1,
							ease: 'easeInOut',
						}}
						exit={{
							opacity: 0,
							y: -100,
							filter: 'blur(10px)',
							transition: {
								duration: 0.5,
								ease: 'easeInOut',
							},
						}}
					>
						<motion.div className="flex flex-col justify-center text-center bg-gradient-to-tr from-green-400 to-blue-500 h-1/2 w-3/4 rounded-3xl border border-white border-solid drop-shadow-xl">
							<motion.h1 className="text-5xl">The journey of a cheese sandwich</motion.h1>
							<motion.h1 className="text-xl">use left or right arrow keys to move</motion.h1>
							<motion.h1 className="text-base">if you're on mobile, too bad use a desktop</motion.h1>
						</motion.div>
					</motion.div>
				)}
				<div className="absolute flex items-center justify-center w-full h-full text-[3.5vh] z-10" key={randomKey()}>
					{step === 1 && (
						<Text>
							The digestive system is used to digest the food we eat. The process of digestion is break down big
							molecules (foods) that is insoluble into smaller sized molecules that is soluble for our body. There are
							two types of digestion: Mechanical digestion is when you physically break down the food using teeth.
							Chemical digestion is when you chemically break up the food with acids such as enzymes or saliva. This
							process has many different stages, the first stage starts in the mouth.
						</Text>
					)}
					{step === 3 && (
						<CheeseSandwichNutrients
							list={[
								'Wheat Bread (Per 32g)',
								'Calories: 82',
								'Fat: 1.1g',
								'Sodium: 144mg',
								'Calories: 82',
								'Carbohydrates: 13.8g',
								'Fiber: 1.9g',
								'Sugar: 1.4g',
								'Protein: 4g',
								'Manganese: 0.7mg',
							]}
						/>
					)}
					{step === 4 && (
						<CheeseSandwichNutrients
							list={[
								'Butter (Per 100g)',
								'Calories: 717',
								'Cholesterol: 215mg',
								'Vitamin A: 2499amu',
								'Calcium: 24mg',
								'Magnesium: 2mg',
								'Potassium: 24mg',
								'Sodium: 11mg',
							]}
						/>
					)}
					{step === 5 && (
						<CheeseSandwichNutrients
							list={[
								'Alouette Cheese (Per 28g)',
								'Calories: 100',
								'Calcium: 150mg',
								'Cholesterol: 30mg',
								'Sodium: 168mg',
								'Vitamin A: 200amu',
							]}
						/>
					)}
					{step === 7 && (
						<Text>
							When the food gets in your mouth, your body will first try to mechanically digest them with your teeth.
							This will break the food down into smaller pieces, this allows your body chemically to digest the food
							more easily.
						</Text>
					)}
					{step === 8 && (
						<Text>
							In the meantime, your salivary glands will produce saliva and it will slide into your mouth. Saliva serves
							a lot of propose, not only it allows your digestive system to start chemical digestion in your mouth, but
							it also helps keep your mouth moist and comfortable, help you chew, taste and swallow, kill germs in your
							mouth to prevent bad breath and it has proteins and minerals that protect your teeth from getting decayed.
							People usually call saliva spittle.
						</Text>
					)}
					{step === 9 && (
						<Text>
							Tongue is a muscular organ that controls the position of food in your mouth, and it is used in the act of
							swallowing. The upper part of your tongue is covered by taste buds which contain the taste receptor cells.
							The tongue also serves a role in cleaning the teeth and enables speech. Your mouth turns the cheese
							sandwich into a ball for easy swallow.
						</Text>
					)}
					{step === 10 && (
						<Text>
							Before the food arrives the esophagus, there is a flap called the epiglottis that prevent food and water
							from entering the trachea and the lungs. It stays open while breathing and close itself during swallowing.
						</Text>
					)}
					{step === 11 && (
						<Text>
							The esophagus (also known as gullet or food pipe) is a fibromuscular tube that passes food from your
							pharynx (throat) all the way down to the stomach through a series of contractions.
						</Text>
					)}
					{step === 12 && (
						<Text>
							Now the cheese sandwich has been broken down into small pieces, but it is still not good enough to be
							absorbed by your body.
						</Text>
					)}
					{step === 13 && (
						<Text>
							The second phase in the digestive system is the stomach following mastication (chewing). It is also the
							first organ that will start the most important chemical digestion by releasing digestive enzymes and
							gastric acid and mix them with the cheese sandwich. The pyloric sphincter controls where the chyme
							(partially digested food) go from the stomach to the duodenum. But for time reason let us just assume that
							it magically arrived the small intestine.
						</Text>
					)}
					{step === 14 && (
						<Text>
							Right next to the stomach it is the liver. It is the largest organ in our body. It produces biochemicals
							that is necessary for digestion. It also plays a role in metabolism such as decomposition of red blood
							cells and the production of hormones.
						</Text>
					)}
					{step === 15 && (
						<Text>
							Gallbladder is used to store bile which is something that is produced by the liver, then release it into
							the duodenum that help digest fat. It is a hollow organ that is located beneath the liver.
						</Text>
					)}
					{step === 16 && (
						<Text>
							The pancreas also plays a very important role in digestive system. It is use for releasing pancreatic
							juice that have bicarbonate to neutralize the chyme, as well as other enzymes that assist digestion and
							absorption of nutrients in the small intestine. This organ also plays a role in the endocrine system that
							help release hormones that can reduce high blood sugar levels (Insulin) or reduce low blood sugar levels
							(Glucagon). Type 1 and Type 2 diabetes are common pancreatic conditions.
						</Text>
					)}
					{step === 17 && (
						<Text>
							The cheese sandwich is definitely easier to absorb at this point. Carbohydrate, fat, and protein have now
							been broken down from the food with enzymes. Your body should have already absorbed some of them by now,
							but it can do better than this.
						</Text>
					)}
					{step === 18 && (
						<Text>
							The small intestine is where most of the nutrients and minerals from the food is absorbed using villi. The
							small intestine has three parts.
						</Text>
					)}
					{step === 19 && (
						<Text>
							The upper part is called the duodenum, the shortest and the widest part of the small intestine. Its job is
							to mix up the digestive enzymes the stomach produces with the chyme to further break down the food.
							Meanwhile neutralize the stomach acid with pancreatic juice that got produced by pancreas. Ion and folate
							are absorbed here.
						</Text>
					)}
					{step === 20 && (
						<Text>
							The middle part is called the jejunum. This is the part most of the nutrients gets absorbed which are
							carbohydrates, fats, minerals, proteins, and vitamins.
						</Text>
					)}
					{step === 21 && (
						<Text>
							The lowest part is called the ileum. This is the last part of digestive absorption take place. This part
							absorbs bile acids, fluid, and vitamin B-12.
						</Text>
					)}
					{step === 22 && (
						<Text>
							The large intestine, also known as the colon, is the last part of the gastrointestinal tract. Water is
							absorbed here, and the remaining undigested food has been stored as feces before it is ejected by
							defecation.
						</Text>
					)}
					{step === 23 && (
						<Text>
							At this point, there is no more nutrients in the cheese sandwich anymore, it has turned in to feces
							already.
						</Text>
					)}
					{step === 24 && (
						<Text>
							The rectum is the last part of the large intestine, and it is where the feces are stored. It also tries to
							more solidify the feces if possible.
						</Text>
					)}
					{step === 25 && (
						<Text>
							The anus is the external opening of the rectum. The main function it has is control the exit of the fences
							from the rectum during an act of defecation using two sphincters which are the important muscles it
							contains. The anal sphincter has both inner and outer muscles. The inner sphincter prevents feces from
							leaking out and the outer feces allows you to hold or pass the feces on demand. Urethral sphincters
							control the passing of urine, it also has two muscles just like the anal sphincter.
						</Text>
					)}
					{step === 26 && (
						<Text>
							<div className="flex flex-col items-center justify-center text-center">
								<h1 className="text-[5vh]">Thanks for Watching</h1>
								<img src="/rick-astley-dance.gif" alt="Rick Astley Dance" />
							</div>
						</Text>
					)}
				</div>
				{step === 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
						}}
						transition={{
							duration: 1,
						}}
						exit={{ opacity: 0, transition: { duration: 0.5 } }}
					>
						<Particles
							init={particlesInit}
							options={{
								particles: {
									color: {
										value: '#15a9bb',
									},
									collisions: {
										enable: true,
									},
									move: {
										enable: true,
										outModes: {
											default: 'bounce',
										},
										random: false,
										speed: 1,
										straight: false,
									},
									number: {
										value: 50,
									},
									opacity: {
										value: 0.5,
									},
									shape: {
										type: 'circle',
									},
									size: {
										value: { min: 1, max: 5 },
									},
								},
								detectRetina: true,
							}}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<motion.div
				className="flex items-center justify-center absolute w-full h-full opacity-0 blur-[10px]"
				ref={mainImage}
			>
				<div className="h-[90%] relative">
					<AnimatePresence>
						{(step === 7 || step === 8) && (
							<motion.div
								key={7}
								className="absolute"
								initial={{
									opacity: 0,
									filter: 'blur(10px)',
									x: 40,
									y: '-6.5vh',
									scale: 0,
								}}
								animate={{
									opacity: 1,
									filter: 'blur(0px)',
									x: 50,
									y: '-6.5vh',
									scale: 0.09,
								}}
								exit={{
									opacity: 0,
									filter: 'blur(10px)',
									scale: 0,
								}}
								transition={{
									duration: 1,
									ease: 'easeInOut',
								}}
							>
								<img src="/mouth.gif" alt="Mouth" />
							</motion.div>
						)}
					</AnimatePresence>
					<motion.svg
						className="h-full w-full"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						x="0px"
						y="0px"
						viewBox="0 0 333 372.8"
						aria-labelledby="title"
					>
						<title id="title">Digestive System</title>
						<g id="Artwork">
							<path
								id="Body"
								fill={bodyColors.body}
								d="M68 298l1 14v13c-1 4 1 8 3 12 1 4 5 6 9 7 2 2 9 7 12 4 2-2-4-8-6-10-2-3-4-8-3-12l2-1 1 1 1 7c1 5 6 4 7 1v-5l-1-9c0-3 0-6-2-9l-5-6v-9l14-41 2-7 1-12v-6l2-17c2-4 3-18 4-22l1 3c2 11 3 41 2 52l-4 17-1 5c-4 14-3 32-3 41l2 64h52l1-1 6-45c2 0 7 29 8 44v2h51l3-64c0-9 1-27-2-41l-2-5-4-17c0-11 0-41 2-52l1-3 4 22 2 17v6l2 12 1 7 2 9 13 32c0 3 1 6-1 9l-5 6-2 9-1 9v5c2 3 6 4 7-1l1-7 2-1 1 1c2 4 0 9-3 12-1 1-8 8-6 10 3 2 10-2 13-4 4-2 7-3 9-7l3-12v-13-14-3s3-44 2-53c-2-9-5-26-8-34l-1-23-2-20-3-12v-7-6c0-4 0-9-2-14-1-6-4-10-8-13s-9-4-14-6l-33-11c-6-3-6-9-4-13l4-1h10c5-1 5-6 5-7v-4c3-1 2-4 2-4 1 0 2-1 1-2v-3c0-3 0-2 2-3l5-1 1-4s-8-11-8-13l2-4-1-6-4-11c1 0 5-7-7-12l-19-7-20-1c-6 0-18 0-18 7-7 3-14 13-14 16-1 5-3 15-1 21l9 19c3 4 4 9 4 14l-1 12-2 5-38 13c-5 1-9 3-13 6-5 3-7 7-9 13a62 62 0 0 0-2 20v7l-3 12-2 20-1 23-7 34c-2 9 1 53 1 53v3z"
							></path>
							<motion.path
								id="Liver"
								animate={{
									opacity: bodyOpacities.liver,
								}}
								fill={bodyColors.liver}
								d="M178 192c2 1 5 3 2 6-7 9-8 19-18 21-3 1-6 1-7 3-6 11-20 17-23 19-2 1-4 2-6 0-3-2-6-8-7-11-3-9-5-19-1-28 3-6 8-7 14-7 19 0 14-3 21-4 9-3 15-1 25 1z"
							></motion.path>
							<motion.path
								id="Pancreas"
								animate={{
									opacity: bodyOpacities.pancreas,
								}}
								fill={bodyColors.pancreas}
								d="M177 223c-4-1-10 1-16 1-8-1-16 1-15 5 0 7 7 7 17 5 16-3 22-10 14-11z"
							></motion.path>
							<motion.path
								id="Small_Intestine_1"
								animate={{
									opacity: bodyOpacities.small_intestine_1,
								}}
								d="M 155 242 L 146 245 L 141 246 C 134 248 130 255 130 260 C 131 264 132 266 135 267 L 135 267 L 137 261 L 137 261 L 138 257 L 142 252 H 146 C 151 252 157 250 163 245 L 155 242 Z"
								fill={bodyColors.small_intestine}
							></motion.path>
							<motion.path
								id="Small_Intestine_2"
								animate={{
									opacity: bodyOpacities.small_intestine_2,
								}}
								d="M 135 267 C 135 267 132 266 135 267 S 140 267 142 266 L 144 262 L 146 260 V 262 C 148 264 149 267 152 267 C 154 267 155 266 156 264 L 158 261 L 159 259 L 160 261 L 163 265 C 165 267 167 268 169 267 C 172 266 173 263 174 261 L 175 258 L 176 259 V 260 C 177 261 178 264 181 265 H 182 C 186 265 189 260 189 260 L 191 257 V 262 L 191 262 L 198 259 C 198 258 200 255 198 252 S 194 249 192 249 C 188 249 186 253 184 256 H 183 L 182 257 V 256 C 180 254 179 252 176 251 S 171 252 170 253 L 167 258 V 259 H 166 L 164 255 L 159 252 C 155 252 153 256 152 258 L 150 256 C 148 253 147 253 145 253 C 141 254 139 257 138 260 L 137 261 L 137 261 L 135 267"
								fill={bodyColors.small_intestine}
							></motion.path>
							<motion.path
								id="Small_Intestine_3"
								animate={{
									opacity: bodyOpacities.small_intestine_3,
								}}
								d="M 191 262 V 262 L 193 264 L 188 263 C 186 264 185 265 184 268 V 272 H 183 V 270 L 179 264 L 174 263 C 171 265 171 268 170 273 V 275 L 169 276 L 168 275 L 167 273 L 166 268 C 164 265 161 265 160 265 C 156 266 154 270 153 273 L 152 272 C 151 268 150 266 147 265 C 146 265 144 265 142 267 L 140 271 L 138 274 L 137 275 H 136 L 131 274 C 129 274 128 276 128 278 S 130 281 132 281 H 134 L 138 282 C 142 281 145 277 146 274 L 147 276 V 277 C 148 278 149 282 154 282 L 158 279 L 160 275 V 274 L 161 275 L 163 280 C 164 282 167 283 169 283 C 172 283 174 281 176 279 L 177 274 V 275 C 178 277 179 280 182 281 C 184 282 185 281 186 280 C 189 278 190 275 190 272 V 271 V 270 L 193 271 C 197 272 200 273 203 271 L 205 268 C 205 266 204 265 202 263 L 199 260 L 198 259 L 191 262"
								fill={bodyColors.small_intestine}
							></motion.path>
							<motion.path
								id="Epiglottis"
								ref={epiglottis}
								animate={{
									opacity: bodyOpacities.epiglottis,
									y: 5,
									originX: -0.1,
								}}
								d="M 173 80 L 173 78 L 162.2 78 L 162.2 80"
								fill={bodyColors.epiglottis}
							></motion.path>
							<motion.path
								id="Esophagus"
								animate={{
									opacity: bodyOpacities.esophagus,
								}}
								d="M174 194l-1-18V65c3-2 8-3 16-3h9c5 1 8 3 8 5v2l-2 1-2 2 2 1 4-2 1-4c0-4-4-6-11-7l-9-1c-7 0-12 0-16 2v-5l3-3c4-3 8-4 14-4l7 1c7 2 12 6 13 6l4-1c1-1 2-3 0-5-4-4-9-6-15-8l-8-1-13 2-8 4c-5 3-7 6-7 7l-1 2 1 122s-1 13 1 24l10-8z"
								fill={bodyColors.esophagus}
							></motion.path>
							<motion.path
								id="Stomach"
								animate={{
									opacity: bodyOpacities.stomach,
								}}
								d="M164 202l3 12c1 2 0 3-2 3l-6 3-2 4c-2 4-2 8 1 11l3 2-6 5 8 3 8-7c7-1 14-2 19-6 11-8 26-26 13-38-3-3-7-5-13-4-9 0-10 12-15 12l-1-8-10 8z"
								fill={bodyColors.stomach}
							></motion.path>
							<motion.path
								id="Gallbladder"
								animate={{
									opacity: bodyOpacities.gallbladder,
								}}
								fill={bodyColors.gallbladder}
								d="M146 228c-5 0-6-3-8-7l3-7 2-5c-1 0-2 0-3 4l-3 5c-1-3-2-6-8-5s-5 8 0 8c4 0 6-5 8 0 2 6 2 8 9 8v-1z"
							></motion.path>
							<motion.path
								id="Tongue"
								animate={{
									opacity: bodyOpacities.tongue,
								}}
								fill={bodyColors.tongue}
								d="M189 60c-6 0-13 1-16 3v11c3-2 9-3 14-2 11 2 21 0 21-4s-8-8-19-8z"
							></motion.path>
							<motion.path
								id="Salivary_glands"
								animate={{
									opacity: bodyOpacities.salivary_glands,
								}}
								fill={bodyColors.salivary_glands}
								d="M180 60l1-1a30 30 0 0 0-21-9l2-5c0-4-5-3-9 2-2 4-3 12 2 13 4 0 4-5 4-8 6 0 11 1 14 3l7 5zM201 71h-4l-9 2h-2c-3 0-4 3-3 3h2v1c-1 0-2 4-6 5-2-1-3-2-4 0-2 2 2 5 5 5 4 1 6-2 5-3l-5-1c4-2 6-5 6-5l1-2c1 1 3 2 4 0 1-1 0-1-1-2l7-1h4v-2z"
							></motion.path>
							<motion.path
								id="Large_Intestine"
								animate={{
									opacity: bodyOpacities.large_intestine,
								}}
								fill={bodyColors.large_intestine}
								d="M216 260l-5-6c-2-2 1-6 0-8-1-4-6-7-10-7-4-1-6 5-9 3l-6-4h-11c-6 3-15-8-19 0-1 2-4 2-5 1-2-4-10-3-13-2-4 1-4 4-8 5h-7c-3 3-6 6-6 10 1 3 6 8 2 10-6 2-1 24 4 25 3 1 4 0 5-1l2 1c2 2 3 5 3 8l1 2 2-2a14 14 0 0 0-7-12v-1c1-3 2-13 1-16s-5-4-5-6c0-3 5-4 6-6 2-2 2-6 4-7s4 1 6 1c5 1 7-1 11-3 2-2 6 2 8 3 3 0 6 1 9-1 2-1 3-5 6-2s4 4 9 4c3 0 9-3 11-1 3 2 3 4 8 3 3 0 4 4 1 5-3 2-1 9 1 11 3 5-1 5-5 5-5 0-8 1-10 5-4 4-15-3-20 3-2 2 1 2 0 4-1 3-2 2-4 2-3 0-5 1-5 3v6c1 2 3 2 3 5h5c-1-2 2-3 3-5s0-10 5-8c3 1 7 0 9-2 3-1 2-2 3-4 1-3 6 1 8 1 4 0 10-1 12-4v-6c2-2 5-1 7-4v-8z"
							></motion.path>
							<motion.path
								id="Rectum"
								animate={{
									opacity: bodyOpacities.rectum,
								}}
								fill={bodyColors.rectum}
								d="M170 322l3-5c1-3 2-8 1-11s-3-3-4-5l-1-1h-5c0 3-5 3-5 7l4 15h7z"
							></motion.path>
							<motion.path
								id="Anus"
								animate={{
									opacity: bodyOpacities.anus,
								}}
								fill={bodyColors.anus}
								d="M163 322l1 1c2 3 4 2 6-1h-7z"
							></motion.path>
							<motion.circle
								id="Food"
								ref={food}
								initial={{
									opacity: 0,
								}}
								cx="180"
								cy="66"
								r="5"
								fill="#fbff00"
							/>
						</g>
						<motion.g
							initial={{
								opacity: 1,
							}}
							animate={
								showText
									? {
											opacity: 1,
									  }
									: {
											opacity: 0,
									  }
							}
							id="Label_Lines_Circles"
						>
							<g className="label_line">
								<path
									d="M165 324h134"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Anus"
								></path>
								<text
									className="Anus"
									textAnchor="end"
									transform="translate(333 327)"
									fill={bodyColors.mainImageText}
									fontSize="13px"
								>
									Anus
								</text>
								<circle cx="166.8" cy="323.7" fill={bodyColors.mainImageTextStroke} r="2" className="Anus"></circle>
							</g>
							<g className="label_line">
								<path
									d="M202 68h84"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Tongue"
								></path>
								<text
									className="Tongue"
									textAnchor="end"
									transform="translate(333 71)"
									fill={bodyColors.mainImageText}
									fontSize="13px"
								>
									Tongue
								</text>
								<circle cx="202.1" cy="67.4" fill={bodyColors.mainImageTextStroke} r="2" className="Tongue"></circle>
							</g>
							<g className="label_line">
								<path
									d="M150 229h124"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Pancreas"
								></path>
								<text
									className="Pancreas"
									textAnchor="end"
									transform="translate(333 232)"
									fill={bodyColors.mainImageText}
									fontSize="13px"
								>
									Pancreas
								</text>
								<circle cx="151.1" cy="228.7" fill={bodyColors.mainImageTextStroke} r="2" className="Pancreas"></circle>
							</g>
							<g className="label_line">
								<path
									d="M198 196h80"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Stomach"
								></path>
								<text
									className="Stomach"
									textAnchor="end"
									transform="translate(333 199)"
									fill={bodyColors.mainImageText}
									fontSize="13px"
								>
									Stomach
								</text>
								<circle cx="197.6" cy="195.8" fill={bodyColors.mainImageTextStroke} r="2" className="Stomach"></circle>
							</g>
							<g className="label_line">
								<path
									d="M196 266h84"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Small_Intestine"
								></path>
								<text
									className="Small_Intestine"
									textAnchor="end"
									transform="translate(333 261)"
									fill={bodyColors.mainImageText}
									fontSize="13px"
								>
									Small intestine
								</text>
								<circle
									cx="197"
									cy="266.1"
									fill={bodyColors.mainImageTextStroke}
									r="2"
									className="Small_Intestine"
								></circle>
							</g>
							<g className="label_line">
								<path
									d="M49 313h118"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Rectum"
								></path>
								<text className="Rectum" transform="translate(0 316)" fill={bodyColors.mainImageText} fontSize="13px">
									Rectum
								</text>
								<circle cx="166.5" cy="312.5" fill={bodyColors.mainImageTextStroke} r="2" className="Rectum"></circle>
							</g>
							<g className="label_line">
								<path
									d="M53 267h72"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Large_Intestine"
								></path>
								<text
									className="Large_Intestine"
									transform="translate(0 262)"
									fill={bodyColors.mainImageText}
									fontSize="13px"
								>
									Large intestine
								</text>
								<circle
									cx="123.9"
									cy="267.4"
									fill={bodyColors.mainImageTextStroke}
									r="2"
									className="Large_Intestine"
								></circle>
							</g>
							<g className="label_line">
								<path
									d="M69 90h100"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Esophagus"
								></path>
								<text className="Esophagus" transform="translate(0 93)" fill={bodyColors.mainImageText} fontSize="13px">
									Esophagus
								</text>
								<circle cx="168.7" cy="89.5" fill={bodyColors.mainImageTextStroke} r="2" className="Esophagus"></circle>
							</g>
							<g className="label_line">
								<path
									d="M99 51h64"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Salivary_glands"
								></path>
								<text
									className="Salivary_glands"
									transform="translate(0 55)"
									fill={bodyColors.mainImageText}
									fontSize="13px"
								>
									Salivary glands
								</text>
								<circle
									cx="155.8"
									cy="51.3"
									fill={bodyColors.mainImageTextStroke}
									r="2"
									className="Salivary_glands"
								></circle>
							</g>
							<g className="label_line">
								<path
									d="M71 216h62"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Gallbladder"
								></path>
								<text
									className="Gallbladder"
									transform="translate(0 219)"
									fill={bodyColors.mainImageText}
									fontSize="13px"
								>
									Gallbladder
								</text>
								<circle
									cx="130.8"
									cy="216.1"
									fill={bodyColors.mainImageTextStroke}
									r="2"
									className="Gallbladder"
								></circle>
							</g>
							<g className="label_line">
								<path
									d="M32 185h98v16"
									fill="none"
									stroke={bodyColors.mainImageTextStroke}
									strokeMiterlimit="10"
									className="Liver"
								></path>
								<text className="Liver" transform="translate(0 189)" fill={bodyColors.mainImageText} fontSize="13px">
									Liver
								</text>
								<circle className="Liver" cx="130.4" cy="200.6" fill={bodyColors.mainImageTextStroke} r="2"></circle>
							</g>
						</motion.g>
					</motion.svg>
				</div>
			</motion.div>
			<motion.div ref={sandwich} className="fixed opacity-0 blur-[10px] w-full h-full">
				<CheeseSandwich rotate={sandwichRotate} step={sandwichStep} />
			</motion.div>
		</div>
	);
}

function randomKey() {
	return Math.random().toString(36).substr(2, 9);
}

export default App;
