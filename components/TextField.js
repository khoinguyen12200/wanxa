import React from 'react'
import { ErrorMessage, useField } from 'formik';
import styles from '../styles/TextField.module.css'


export default function TextField({ label, ...props }) {
    const [field, meta] = useField(props);

    return (
        <div className={styles.layout}>
            <label htmlFor={field.name} className={styles.label}>{label}</label>
            <input type="text" className={`form-control  ${meta.touched && meta.error && "is-invalid"} ${styles.input}`} {...field} {...props} autoComplete="off" />
            <ErrorMessage component="p" name={field.name} className={styles.error}/>

        </div>
    )
}

export function FileField({ label, ...props }) {
    const [field, meta] = useField(props);
    return (
        <div className={styles.layout}>
            <label htmlFor={field.name} className={styles.label}>{label}</label>
            <div className="input-group">
                <div class="custom-file">
                    <input class="custom-file-input" type='file' name='avatar' {...props}  />
                    <label class="custom-file-label" htmlFor="inputGroupFile01">{field.value && field.value.name}</label>
                </div>
            </div>

        </div>
    )
}