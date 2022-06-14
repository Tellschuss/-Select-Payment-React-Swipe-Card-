const { useSprings, interpolate, animated, useSpring } = ReactSpring;
const { useDrag } = ReactUseGesture;
const { useState } = React;
const rootElement = document.getElementById("root");

const arr = [
	{
		style: {
			backgroundImage:
				"linear-gradient(-225deg, #A445B2 0%, #D41872 52%, #FF0066 100%)"
		},
		background: "#dc1570",
		detail: {
			balance: 6094,
			cvc: 323,
			m: 2,
			y: 23,
			num: "1234 **** **** 3234"
		}
	},
	{
		style: {
			backgroundImage:
				"linear-gradient(-225deg, #3D4E81 0%, #5753C9 48%, #6E7FF3 100%)"
		},
		background: "#5c5dd3",
		detail: {
			balance: 21233,
			cvc: 777,
			m: 12,
			y: 20,
			num: "3241 **** **** 2233"
		}
	},
	{
		style: {
			background:
				"linear-gradient(-225deg, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%)",
			backgroundBlendMode: "multiply"
		},
		background: "#3c3c3c",
		detail: {
			balance: 5793,
			cvc: 109,
			m: 4,
			y: 30,
			num: "1030 **** **** 3040"
		}
	},
	{
		style: {
			backgroundImage: "linear-gradient(-225deg, #00c6fb 0%, #005bea 100%)"
		},
		background: "#008af1",
		detail: {
			balance: 3443,
			cvc: 993,
			m: 10,
			y: 25,
			num: "0029 **** **** 2303"
		}
	},
	{
		style: {
			backgroundImage:
				"linear-gradient(-225deg, #9EFBD3 0%, #57E9F2 48%, #45D4FB 100%)"
		},
		background: "#5beaf0",
		detail: {
			balance: 1324,
			cvc: 124,
			m: 5,
			y: 31,
			num: "1000 **** **** 2606"
		}
	}
];

const Head = (props) => {
	const { m, y, num } = props;
	return (
		<div id="cardContent">
			<div
				style={{
					display: "flex",
					justifyContent: "space-between"
				}}
			>
				<img
					style={{
						height: "30px"
					}}
					src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
				/>
				<img
					style={{
						height: "20px"
					}}
					src="https://cdn.visa.com/cdn/assets/images/logos/visa/logo.png"
				/>
			</div>
			<div id="num">{num}</div>
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					flexDirection: "row"
				}}
			>
				<div id="label">
					Expires
					<div id="expiry">
						{m}/{y}
					</div>
				</div>
				<div id="num" style={{ fontSize: "13px" }}>
					YUGAM DHURIYA
				</div>
			</div>
		</div>
	);
};

const setBoxShadow = (isActive, alreadyOnTop) => {
	if (isActive && alreadyOnTop) {
		// return "rgba(0, 0, 0, 0.44) 0px 0px 34px 0px";
		return "0px 27px 43px -24px rgba(0, 0, 0, 0.438)";
	} else if (alreadyOnTop) {
		return "none";
	} else {
		return "0px 27px 43px -24px rgba(0, 0, 0, 0.438)";
	}
};

function Card(props) {
	const { arr, num, currentCard, data, setCurrentCard } = props;
	//checks if the card should be able to move.
	const shouldMove = num === 1 + currentCard;
	//checks if the card is already on top.
	const alreadyOnTop = currentCard >= num;
	// check if card is active on top.
	const isActive = currentCard === num;
	// handle zindexes.
	const [zIndex, setZindex] = useState(arr.length - num);
	// handle position on interactions.
	const [{ posx, posy }, setPos] = useState(() => ({
		posx: 0,
		posy: isActive ? -155 : 0
	}));
	const bind = useDrag(
		({ down, movement: [, my], distance, direction: [, yDir], velocity }) => {
			const dir = yDir < 0 ? -1 : 1;
			const rest = alreadyOnTop ? -155 : 0;
			const shouldTrigger = !down && velocity > 0.2 && num !== 0 ;
			if (isActive - 1 || alreadyOnTop) {
				if (dir === -1 && shouldTrigger && !alreadyOnTop) {
					setPos({ posx: 0, posy: -155 });
					setTimeout(() => {
						setCurrentCard(1 + currentCard);
						setZindex(arr.length + num);
					}, 280);
				} else if (dir === 1 && shouldTrigger && alreadyOnTop) {
					setPos({ posx: 0, posy: 0 });
					setTimeout(() => {
						setCurrentCard(currentCard - 1);
						setZindex(arr.length - num);
					}, 280);
				} else if (down && shouldMove) {
					setPos({
						posy: down ? (isActive ? my - 155 : my) : rest
					});
					setZindex(10);
				} else {
					setPos({
						posy: down ? (isActive ? my - 155 : my) : rest
					});
					setTimeout(() => {
						if (alreadyOnTop) {
							setZindex(arr.length + num);
						} else {
							setZindex(arr.length - num);
						}
					}, 280);
				}
			}
		}
	);
	const yDir = alreadyOnTop ? -155 : shouldMove ? posy : 0;
	const yOffset = isActive ? 0 : 30 * (num - currentCard);
	const [{ x, y, scale, top }, set] = ReactSpring.useSpring(() => ({
		x: 0,
		y: yDir,
		scale: alreadyOnTop ? 1 : 1 - (num - currentCard - 1) / 10,
		top: yDir + yOffset
	}));
	if (isActive) {
		set({ x: 0, y: posy, top: posy + yOffset, scale: 1 });
	} else if (shouldMove) {
		set({ x: 0, y: yDir, top: yDir + yOffset, scale: 1 });
	} else if (alreadyOnTop) {
		set({ x: 0, top: -155, y: -155, scale: 1 });
	} else {
		set({
			x: 0,
			y: 1 - (num - currentCard) / 10,
			top: yDir + yOffset,
			scale: 1 - (num - currentCard - 1) / 10
		});
	}
	return (
		<animated.div
			id="card"
			{...bind()}
			style={{
				zIndex: zIndex,
				boxShadow: setBoxShadow(isActive, alreadyOnTop),
				...data.style,
				transform: interpolate(
					[
						y
							.interpolate({ range: [0, -155], output: [60, 0] })
							.interpolate((y) => `rotate3d(1, 0, 0, ${y}deg)`),
						top.interpolate((top) => `translate3D(0px, ${top}px, 0px )`),
						scale.interpolate((scale) => `scale(${scale})`)
					],
					(rotate3d, translate3D, scale) => `${rotate3d} ${translate3D} ${scale}`
				)
			}}
		>
			{Head(data.detail)}
			<div
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					backgroundColor: "#000",
					transition: ".3s",
					borderRadius: '10px',
					opacity: isActive ? 0 : (num + 2 - currentCard) / 10
				}}
			/>
		</animated.div>
	);
}

const App = () => {
	const [currentCard, setCurrentCard] = React.useState(0);
	const props = ReactSpring.useSpring({
		bal: arr[currentCard].detail.balance,
		cvc: arr[currentCard].detail.cvc,
		m: arr[currentCard].detail.m,
		y: arr[currentCard].detail.y
	});
	return (
		<div id="container">
			<div id="details">
				<div id="detail">
					<animated.div>
						{props.bal.interpolate((x) => "$ " + x.toFixed(0))}
					</animated.div>
					<div id="infolabel">Balance</div>
				</div>
				<div id="detail">
					<div id="exp">
						<animated.div>
							{props.m.interpolate((x) => x.toFixed(0) + "/")}
						</animated.div>
						<animated.div>{props.y.interpolate((x) => x.toFixed(0))}</animated.div>
					</div>
					<div id="infolabel">Expires</div>
				</div>
				<div id="detail">
					Yugam<div id="infolabel">Card Holder</div>
				</div>
				<div id="detail">
					<animated.div>{props.cvc.interpolate((x) => x.toFixed(0))}</animated.div>
					<div id="infolabel">CVC</div>
				</div>
			</div>
			<div id="app">
				{arr.map((val, i) => {
          return (
            <Card
              key={i}
              num={i}
              arr={arr}
              data={val}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
			</div>
		</div>
	);
}

ReactDOM.render(<App/>,rootElement);
