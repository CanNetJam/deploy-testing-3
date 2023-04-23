import React, { useEffect, useRef, useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import format from 'date-fns/format'
import { addDays } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

function DateRangePickerComp(props) {
    const [range, setRange] = useState([
        {
        startDate: addDays(new Date(), -29),
        endDate: new Date(),
        key: 'selection'
        }
    ])
    const [open, setOpen] = useState(false)
    const refOne = useRef(null)
    
    useEffect(() => {
        const rangeUpdate = async () => {
            props.setDateRange({
                startDate: range[0].startDate.toISOString(),
                endDate: range[0].endDate.toISOString()
            })
        }
        rangeUpdate()
    }, [range])

    useEffect(() => {
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)
    }, [])

    const hideOnEscape = (e) => {
        if( e.key === "Escape" ) {
        setOpen(false)
        }
    }

    const hideOnClickOutside = (e) => {
        if( refOne.current && !refOne.current.contains(e.target) ) {
        setOpen(false)
        }
    }

    return (
        <div className="calendarWrap">
            <input
                value={`${format(range[0].startDate, "MMMM dd, yyyy")} - ${format(range[0].endDate, "MMMM dd, yyyy")}`}
                readOnly
                className="inputBox"
                onClick={ () => setOpen(open => !open) }
            />

            <div ref={refOne}>
                {open && 
                <DateRangePicker
                    onChange={item => setRange([item.selection])}
                    editableDateInputs={true}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                    months={2}
                    direction="horizontal"
                    className="calendarElement"
                />
                }
            </div>
        </div>
    )
}

export default DateRangePickerComp