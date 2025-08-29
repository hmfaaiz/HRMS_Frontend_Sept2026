import React from 'react'

function CustomDropdown({data, leaveTypData = null, firstElement = null}) {
    const dropdownData = data && Array.isArray(data) ? firstElement ? [{...firstElement}, ...data] : data : [];
    return dropdownData.map((el) => {
        const disabled = leaveTypData && leaveTypData.find(sel => sel.leaveType && sel.leaveType == el.value) ? true : false
        return (<>
            <option disabled={disabled} value={el.value}>{el.label}</option>
        </>)
    })
}

export default CustomDropdown