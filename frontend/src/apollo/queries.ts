import { gql } from '@apollo/client/core';
import getLoansQuery from './graphql/getLoans.gql?raw';
import getLoanByIdQuery from './graphql/getLoanById.gql?raw';

export const GET_LOANS = gql`${getLoansQuery}`;
export const GET_LOAN_BY_ID = gql`${getLoanByIdQuery}`;