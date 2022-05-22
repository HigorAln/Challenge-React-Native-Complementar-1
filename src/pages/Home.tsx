import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { Header } from '../components/Header';
import { Task, TasksList } from '../components/TasksList';
import { TodoInput } from '../components/TodoInput';

export function Home() {
	const [tasks, setTasks] = useState<Task[]>([]);

	const inputRef = useRef<TextInput>(null);

	function handleAddTask(newTaskTitle: string) {
		const taksExists = tasks.find(task => task.title === newTaskTitle);

		if (taksExists) {
			Alert.alert(
				'Task ja cadastrada',
				'Você não pode cadastrar uma task com o mesmo nome',
			);
			return;
		}

		const newTask: Task = {
			id: new Date().getTime(),
			done: false,
			title: newTaskTitle,
		};

		setTasks([...tasks, newTask]);
	}

	function handleToggleTaskDone(id: number) {
		setTasks(
			tasks.map(task => {
				if (task.id === id) {
					task.done = !task.done;
				}

				return task;
			}),
		);
	}

	function handleRemoveTask(id: number) {
		Alert.alert(
			'Remover item',
			'Tem certeza que você deseja remover esse item?',
			[
				{
					text: 'Não',
					style: 'cancel',
				},
				{
					text: 'Sim',
					onPress: () => setTasks(tasks.filter(task => task.id !== id)),
				},
			],
		);
	}

	function handleEditTask(taskId: number, newTaskTitle: string) {
		setTasks(
			tasks.map(task => {
				if (task.id === taskId) {
					task.title = newTaskTitle;
				}
				return task;
			}),
		);
	}

	return (
		<View style={styles.container}>
			<Header tasksCounter={tasks.length} />

			<TodoInput addTask={handleAddTask} inputRef={inputRef} />

			<TasksList
				tasks={tasks}
				toggleTaskDone={handleToggleTaskDone}
				removeTask={handleRemoveTask}
				editTask={handleEditTask}
				inputRef={inputRef}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#EBEBEB',
	},
});
