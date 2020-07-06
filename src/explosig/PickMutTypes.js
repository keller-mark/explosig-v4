import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import fromEntries from 'object.fromentries';
import styled from "styled-components";
import { MUT_TYPE_TO_CAT_TYPES, MUT_TYPES, CAT_TYPES, CAT_TYPE_INFO, getCategoryColors, getSuperCategoryDetails } from './utils/categories';
import { configSlice } from './utils/slices.js';
const { setCatTypes } = configSlice.actions;

const StyledInnerModal = styled.div`
    padding: 0 0.5rem;
`;

function PickMutTypes(props) {
    const {
        catTypes,
        setCatTypes,
    } = props;

    function onCheckCatType(event) {
        const mutTypeToCatType = fromEntries(catTypes.map(catType => ([
            CAT_TYPE_INFO[catType].mutType,
            catType
        ])));

        if(event.target) {
            const { value, checked } = event.target;
            const catTypeInfo = CAT_TYPE_INFO[value];
            const mutType = catTypeInfo.mutType;
            if(checked) {
                mutTypeToCatType[mutType] = value;
            } else {
                mutTypeToCatType[mutType] = undefined;
            }
            const newCatTypes = Object.values(mutTypeToCatType).filter(Boolean);
            setCatTypes(newCatTypes);
        }
    }

    return (
        <StyledInnerModal>
            Select mutation categorizations of interest.
            <ul>
                {MUT_TYPES.map(mutType => (
                    <li key={mutType}>
                        <span>{mutType}</span>
                        <ul>
                            {MUT_TYPE_TO_CAT_TYPES[mutType].map(catType => (
                                <li key={catType}>
                                    <input
                                        type="checkbox"
                                        id={catType}
                                        value={catType}
                                        checked={catTypes.includes(catType)}
                                        onChange={onCheckCatType}
                                    />
                                    <label htmlFor={catType}>{catType}</label>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </StyledInnerModal>
    );
}

const mapStateToProps = (state) => ({
    catTypes: state.config.catTypes,
});

const mapDispatchToProps = (dispatch) => ({
    setCatTypes: catTypes => dispatch(setCatTypes(catTypes)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickMutTypes);