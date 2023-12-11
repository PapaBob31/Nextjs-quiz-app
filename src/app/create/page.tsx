"use client"

import  { useState, useRef } from "react"
import type { Quiz } from "../play-quiz/page"

function Option({ optionNum, removeOption }: {optionNum: number; removeOption: (optionNum: number)=>void}) {
	const [removed, setRemoved] = useState<boolean>(false)

	return (
		<div className={removed ? "removed": undefined}>
			<label>Option</label>
			<input type="text"/>
			<button type="button" onClick={() => {setRemoved(true); setTimeout(()=>removeOption(optionNum), 300)}}>remove</button>
		</div>
	)
}

function QuestionForm({ questionNum, removeQuestion }: {questionNum: number; removeQuestion: (key: number)=>void}) {
	let [optionsKeys, setOptionsKeys] = useState([1, 2])
	let freeKeys = useRef<number[]>([3, 4])

	function removeFromOptions(key: number) {
		let newOptionsKeys = []
		for (let i=0; i<optionsKeys.length; i++) {
			if (key != optionsKeys[i]) {
				newOptionsKeys.push(optionsKeys[i])
			}
		}
		freeKeys.current.push(key)
		setOptionsKeys(newOptionsKeys)
	}

	function generateOptions() {
		let optionsJSX = []
		for (let i=0; i < optionsKeys.length; i++) {
			optionsJSX.push(<Option key={optionsKeys[i]} optionNum={optionsKeys[i]} removeOption={removeFromOptions}/>)
		}
		return optionsJSX
	}

	function addOption() {
		if (optionsKeys.length < 4) {
			let newOptionsKeys = [...optionsKeys]
			newOptionsKeys.push(freeKeys.current[0] as number)
			freeKeys.current.shift()
			setOptionsKeys(newOptionsKeys)
		}
	}

	return (
		<form className="question-form">
			<h2>Question</h2>
			<input type="text"/>
			{generateOptions()}
			<button type="button" onClick={addOption}>Add Option</button>
		</form>
	)
}


export default function CreateQuiz() {
	let [questionsKeys, setQuestionsKeys] = useState<number[]>([])
	let freeKeys = useRef<number[]>([])

	function removeQuestionForm(key: number) {
		let newQuestionsKeys = []
		for (let i=0; i<questionsKeys.length; i++) {
			if (key != questionsKeys[i]) {
				newQuestionsKeys.push(questionsKeys[i])
			}
		}
		freeKeys.current.push(key)
		setQuestionsKeys(questionsKeys)
	}

	function generateQuestionsForms() {
		let questionsForms = []
		for (let i=0; i < questionsKeys.length; i++) {
			questionsForms.push(<QuestionForm key={questionsKeys[i]} questionNum={questionsKeys[i]} removeQuestion={removeQuestionForm}/>)
		}
		return questionsForms
	}

	function addQuestionForm() {
		if (questionsKeys.length < 4) {
			let newQuestionsKeys = [...questionsKeys]
			newQuestionsKeys.push(freeKeys.current[0] as number)
			freeKeys.current.shift()
			setQuestionsKeys(newQuestionsKeys)
		}
	}
	function createQuizData() {

	}
	return (
		<section id="quiz-section">
			<h3>Quiz Name:</h3>
			<input type="text" required={true} max={100}/>
			<h3>Description:</h3>
			<input type="text" required={true}  max={200}/>
			{generateQuestionsForms()}
			<button type="button" onClick={addQuestionForm}>Add Question</button>
			<input type="number" max={50}/>
			<button type="button" >Add Multiple Questions</button>
			<button onClick={createQuizData}>Create</button>
		</section>
	)
}
