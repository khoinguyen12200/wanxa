import React from 'react'
import { ErrorMessage, useField } from 'formik';

export default function TextField({ label, ...props }) {
    const [field, meta] = useField(props);

    return (
        <div className="text-field">
            <label htmlFor={field.name} className="field-label">{label}</label>
            <input type="text" className={`form-control  ${meta.touched && meta.error && "is-invalid"}`} {...field} {...props} autoComplete="off" />
            <ErrorMessage component="p" name={field.name} />

        </div>
    )
}

export function FileField({ label, ...props }) {
    const [field, meta] = useField(props);
    return (
        <div className="text-field">
            <label htmlFor={field.name} className="field-label">{label}</label>
            <div className="input-group">
                <div class="custom-file">
                    {/* <input type="file" class="custom-file-input"
                {...field} {...props} /> */}
                    <input class="custom-file-input" type='file' name='avatar' {...props}  />
                    <label class="custom-file-label" htmlFor="inputGroupFile01">{field.value && field.value.name}</label>
                </div>
            </div>

        </div>
    )
}