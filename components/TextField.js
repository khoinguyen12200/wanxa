import React from "react";
import { ErrorMessage, useField } from "formik";
import { v4 as uuidv4 } from "uuid";
import { UncontrolledTooltip } from "reactstrap";

import styles from "../styles/TextField.module.css";

export default function TextField({ label,tooltip, ...props }) {
	const [field, meta] = useField(props);
	const [viewId, setId] = React.useState("myid" + uuidv4());

	return (
		<div className={styles.layout}>
			<label htmlFor={field.name} className={styles.label}>
				{label}
			</label>
			<input
				id={viewId}
				type="text"
				className={`form-control  ${
					meta.touched && meta.error && "is-invalid"
				} ${styles.input}`}
				{...field}
				{...props}
				autoComplete="off"
			/>
			<ErrorMessage
				component="p"
				name={field.name}
				className={styles.error}
			/>

			{viewId != null && tooltip && (
				<UncontrolledTooltip trigger="focus" target={viewId}>
					{tooltip}
				</UncontrolledTooltip>
			)}
		</div>
	);
}

export function TextAreaField({ label,tooltip, ...props }) {
	const [field, meta] = useField(props);
	const [viewId, setId] = React.useState("myid" + uuidv4());

	return (
		<div className={styles.layout}>
			<label htmlFor={field.name} className={styles.label}>
				{label}
			</label>
			<textarea
				id={viewId}
				className={`form-control  ${
					meta.touched && meta.error && "is-invalid"
				} ${styles.input}`}
				{...field}
				{...props}
				autoComplete="off"
			/>
			<ErrorMessage
				component="p"
				name={field.name}
				className={styles.error}
			/>

			{viewId != null && tooltip && (
				<UncontrolledTooltip trigger="focus" target={viewId}>
					{tooltip}
				</UncontrolledTooltip>
			)}
		</div>
	);
}

export function FileField({ label, hint, ...props }) {
	const [field, meta] = useField(props);
	return (
		<div className={styles.layout}>
			<label htmlFor={field.name} className={styles.label}>
				{label}
			</label>
			<div className="input-group">
				<div className="custom-file">
					<input
						className="custom-file-input"
						type="file"
						name="avatar"
						{...props}
					/>
					<label
						className="custom-file-label"
						style={{ color: "#aaa" }}
						htmlFor="inputGroupFile01"
					>
						{field.value ? field.value.name : hint}
					</label>
				</div>
			</div>
		</div>
	);
}
