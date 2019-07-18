import React, {Component, RenderCounter} from "react";


import {observable, configure, action} from 'mobx';
import {observer} from 'mobx-react';


configure({'enforceActions': 'observed'});

const todoStore = observable({
    
    todos: [],
	pendingRequests: 0,

	get completedTodosCount() {
		return this.todos.filter(todo => todo.completed === true).length;
	},
	get report(){
		if (this.todos.length > 0){
			return `Next todos: "${this.todos.filter(todo => todo.completed === false)[0] 
				? this.todos.filter(todo => todo.completed === false)[0].task
				: "there is no one uncompleted todo. you can go to take a cup of coffee)" }"` 
				+ ' '  
				+ `progress: ${this.completedTodosCount}/${this.todos.length}`
		}
		return null;
	},

	addTodo(task){
        if (!Boolean(task)) return;
		const old_todos = this.todos.slice();
		this.todos = [...old_todos, {
			task: task,
			completed: false,
			assignee: null,
		}]
	}
}, {
	addTodo: action,
}); 


@observer
export default class TodoStores extends Component {

	handleSubmit = event => {
		event.preventDefault();
		const value = this.inputNode.value
		todoStore.addTodo(value)
		this.inputNode.value = ''
	}

	render(){
		const store = todoStore;
		return(
			<div>
				<form
					onSubmit={this.handleSubmit}
				>
					<lable>
						inter your todo: <br/>
						<input 
							type="text"
							ref={node => this.inputNode = node}
						/>
					</lable>
					<button type="submit">
						add todo
					</button>
				</form>
				<div>
					{store.report}
				</div>
				<ul>
					{console.log(store.todos)}
					{store.todos.map((todo, i) => (
						<TodoView key={i} todo={todo} />
					))}
				</ul>
				{store.pendingRequest > 0 
					? <marquee>Loading...</marquee>
					: null 
				}
				<small>double-click on todo to edit</small>
			</div>

		)
	}
}

@observer
class TodoView extends Component{

	@action
	handleEdit = () => {
		const todo = this.props.todo;
		todo.task = prompt('rename your todo: ', todo.task) || todo.task;
	}
	@action
	handleComplete = () => {
		const todo = this.props.todo;
		todo.completed = !todo.completed;
	}

	render(){
		const todo = this.props.todo;
		return (
			<li>
				<input 
					type="checkbox"
					onChange={this.handleComplete}
					checked={todo.completed}
				/>
				<span
					onDoubleClick={this.handleEdit}
					ref={node => this.todoNode = node}
				>
				{todo.competed 
					? 	<strike>
							{todo.task}
							{todo.assignee 
								? <small>{todo.assignee.name}</small> 
								: null
							}
						</strike>
					: 	<span>{todo.task}
							{todo.assignee 
								? <small>{todo.assignee.name}</small> 
								: null
							}
						</span>
				}
				</span>
			</li>
		);
	}
}
