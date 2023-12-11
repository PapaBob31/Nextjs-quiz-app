import { useState, useRef, useEffect } from "react"

interface Option {
	text: string;
	id: string;
}

interface Question {
	prompt: string;
	answer: string;
	id: string;
	options: Option[]
}

export interface Quiz {
	title?: string;
	description?: string;
	id: string;
	questions: Question[];
}

let placeholderQuiz: Quiz = {
	id: "24t24t",
	questions: [
		{prompt: "Question 1", answer: "answer", id: "1",
		options: [
			{text: "answer", id: "1"},
			{text: "answer 2", id: "2"},
		]},
		{prompt: "Question 2", answer: "answer again", id: "2",
		options: [
			{text: "answer", id: "3"},
			{text: "answer again", id: "4"},
		]}
	]
}

function Option({optionData, selectedOption, setSelectedOption, correctOption}: 
	{optionData: Option; selectedOption: Option | null; setSelectedOption: (obj: Option)=>void; correctOption: string|null}) {

	function setAsSelected() {
		if (optionData !== selectedOption) {
			setSelectedOption(optionData)
		}
	}

	let classString = ""
	if (optionData === selectedOption) {
		classString += "selected"
		if (correctOption) {
			if (correctOption !== optionData.text) {
				classString += " wrong"
			}
		}
	}
	if (correctOption) {
		if (correctOption === optionData.text) {
			classString += " right"
		}
	}
	return (
		<button onClick={setAsSelected} className={classString}>{optionData.text}</button>
	)
}

function Question({questionData, getQuizResult, updateScoreFunc}: 
	{questionData: Question; getQuizResult: boolean; updateScoreFunc: (addToScore: boolean)=>void}) {
	const [selectedOption, setSelectedOption] = useState<Option | null>(null)
	useEffect(() => {
		if (getQuizResult) {
			if (selectedOption && selectedOption.text === questionData.answer) {
				updateScoreFunc(true)
			}else {
				updateScoreFunc(false)
			}
		}else {
			setSelectedOption(null)
		}
	}, [getQuizResult])
	
	return (
		<div className="question">
			<p>{questionData.prompt}</p>
			{questionData.options.map(option => <Option key={option.id} optionData={option} selectedOption={selectedOption} 
				setSelectedOption={setSelectedOption} correctOption={getQuizResult ? questionData.answer : null}/>)}
		</div>
	)
}

export default function ExampleQuiz() {
	const score = useRef(0)
	const questionsEvaluated = useRef(0)

	const [quizData, setQuizData] =  useState({resultShown: false, scoreDisplay: 0, reset: false})

	function updateScore(addToScore: boolean) {
		if (addToScore) score.current++
		questionsEvaluated.current++
		if (questionsEvaluated.current === placeholderQuiz.questions.length) {
			setQuizData({...quizData, scoreDisplay: score.current})
		}
	}

	function reset() {
		score.current = 0;
		questionsEvaluated.current = 0
		setQuizData({resultShown: false, scoreDisplay: score.current, reset: true})
	}

	return (
		<>	
			<h2>{quizData.scoreDisplay}</h2>
			<div>
				{placeholderQuiz.questions.map(question => 
				 <Question key={question.id} questionData={question} getQuizResult={quizData.resultShown} updateScoreFunc={updateScore}/>)}
				
				<button id="submit-btn" onClick={() => setQuizData({...quizData, resultShown: true})} disabled={quizData.resultShown}>Submit</button>
				<button id="play-btn" onClick={() => reset()} disabled={!quizData.resultShown}>Play Again</button>
			</div>
		</>
	)
}
