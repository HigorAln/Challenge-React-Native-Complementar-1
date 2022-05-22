import React, { useCallback, useRef, useState } from 'react';
import {
	FlatList,
	Image,
	TouchableOpacity,
	View,
	StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Feather from 'react-native-vector-icons/Feather';

import { ItemWrapper } from './ItemWrapper';

import trashIcon from '../assets/icons/trash/trash.png';
import editIcon from '../assets/icons/edit.png';
import { TextInput } from 'react-native';

export interface Task {
	id: number;
	title: string;
	done: boolean;
}

interface TasksListProps {
	tasks: Task[];
	toggleTaskDone: (id: number) => void;
	removeTask: (id: number) => void;
	editTask: (taskId: number, newTaskTitle: string) => void;
	inputRef: React.RefObject<TextInput>;
}

export function TasksList({
	tasks,
	toggleTaskDone,
	removeTask,
	editTask,
	inputRef,
}: TasksListProps) {
	const [inputInFocus, setInputInFocus] = useState<number | null>();
	const [, setReRender] = useState({});
	const reRender = useCallback(() => setReRender({}), []);
	const [isEdit, setIsEdit] = useState<number | null>(null);

	const textRef = useRef<string>('');

	return (
		<FlatList
			data={tasks}
			keyExtractor={item => String(item.id)}
			contentContainerStyle={{ paddingBottom: 24 }}
			showsVerticalScrollIndicator={false}
			renderItem={({ item, index }) => {
				return (
					<ItemWrapper index={index}>
						<View>
							<View testID={`button-${index}`} style={styles.taskButton}>
								<TouchableOpacity
									testID={`marker-${index}`}
									onPress={() => toggleTaskDone(item.id)}
									style={{
										height: 16,
										width: 16,
										borderRadius: 4,
										borderWidth: 1,
										borderColor: '#B2B2B2',
										marginRight: 15,
										backgroundColor: item.done ? '#1DB863' : 'transparent',
									}}
								>
									{item.done && <Icon name="check" size={12} color="#FFF" />}
								</TouchableOpacity>

								<TextInput
									style={{
										color: item.done ? '#1DB863' : '#666',
										textDecorationLine: item.done ? 'line-through' : 'none',
										width: '50%',
										padding: 0,
									}}
									value={
										inputInFocus === item.id ? textRef.current : item.title
									}
									onChangeText={text => {
										textRef.current = text;
										setIsEdit(item.id);
										reRender();
									}}
									onFocus={() => {
										setInputInFocus(item.id);
										textRef.current = item.title;
									}}
									onSubmitEditing={() => {
										editTask(item.id, textRef.current);
										setIsEdit(null);
										inputRef.current?.focus();
									}}
								/>
							</View>
						</View>

						<View style={styles.viewIcons}>
							{isEdit === item.id && (
								<>
									<TouchableOpacity
										style={{
											marginRight: 5,
											borderRightWidth: 1,
											paddingRight: 5,
											borderRightColor: '#ddd',
										}}
										onPress={() => {
											editTask(item.id, textRef.current);
											setIsEdit(null);
											inputRef.current?.focus();
										}}
									>
										<Feather name="check" size={21} color="#7ea35d" />
									</TouchableOpacity>

									<TouchableOpacity
										style={{
											marginRight: 5,
											paddingRight: 5,
											borderRightColor: '#ddd',
											borderRightWidth: 1,
										}}
										onPress={() => {
											setInputInFocus(null);
											reRender();
											setIsEdit(null);
										}}
									>
										<Feather name="x" size={21} color="#8965ad" />
									</TouchableOpacity>
								</>
							)}

							<TouchableOpacity
								testID={`trash-${index}`}
								onPress={() => removeTask(item.id)}
								style={{
									marginRight: 5,
								}}
							>
								<Image source={trashIcon} />
							</TouchableOpacity>
						</View>
					</ItemWrapper>
				);
			}}
			style={{
				marginTop: 32,
			}}
		/>
	);
}

const styles = StyleSheet.create({
	taskButton: {
		flex: 1,
		paddingHorizontal: 24,
		paddingVertical: 8,
		marginBottom: 4,
		borderRadius: 4,
		flexDirection: 'row',
		alignItems: 'center',
	},
	taskMarker: {
		height: 16,
		width: 16,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#B2B2B2',
		marginRight: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	taskText: {
		color: '#666',
		fontFamily: 'Inter-Medium',
	},
	taskMarkerDone: {
		height: 16,
		width: 16,
		borderRadius: 4,
		backgroundColor: '#1DB863',
		marginRight: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},
	taskTextDone: {
		color: '#1DB863',
		textDecorationLine: 'line-through',
		fontFamily: 'Inter-Medium',
	},
	viewIcons: {
		flexDirection: 'row',
	},
});
