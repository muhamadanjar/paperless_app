type ExamData = {
	page: number
}
let defaultValues: ExamData = {
	page: 1
}

const ExamContext = React.createContext(defaultValues);