



const client = () => {
	
	const test = {
		getTest: async (id: string): Promise<any> => {},
		getTests: async (): Promise<any> => {},
		updateTest: async (id: string): Promise<any> => {}
	}
	
	return {
		test
	}
}

const { test } = client();

test.getTest('id')
/*
	getTest,
	getTests,
	updateTest,
	deleteTest
 */
// requests: {
// 	// [get|update|delete][One|All]
// 	getOne: (props) => {},
// 	getAll: () => {},
// 	updateOne: () => {},
// 	deleteOne: () => {}
// }