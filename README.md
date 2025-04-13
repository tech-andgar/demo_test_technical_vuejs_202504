# Kiva Full Stack Challenge

Thank you for taking time to complete the Kiva coding exercise. This exercise is meant to evaluate your approach to hands-on programming challenges and to provide a concrete basis for follow-up in person interviews, to discuss your design and development process.

While this is not a proctored or timed exercise, we request that you spend no more than two hours on your submission. When you have completed the exercise, email your source code and any other relevant artifacts as a zipped attachment. Please do not include your name anywhere in the code submission.

## Instructions

This challenge is two part.

### Evaluation Criteria

Submissions will be evaluated on (in order of importance):

- Component composition and organization
- Object-oriented approach to data
- Managing and parsing complex data queries
- Testability / testing
- An eye for clean visual results
- Correctness, based on the requirements described above
- Readability of code
- Documentation

### Part One

Create a simple and responsive grid of loan cards (for example, https://www.kiva.org/lend-by-category/women). Your version does not need to be an exact copy of the existing page. You do not need to recreate the site header, the navigation bar, the site footer, filtering, paging, etc.

- Use the included Vue app found in the `frontend` folder
  - How the styling is done is up to you
    - You can use our Vue component library [@kiva/kv-components](https://www.npmjs.com/package/@kiva/kv-components) if you would like, but you can use whatever you want for the styling
  - Query the Kiva GraphQL API to get the loan data for the page
    - The API is located at `https://marketplace-api.k1.kiva.org/graphql`
    - Use whichever tool you would like to make the requests
    - Use a POST request with the application/json content type, and include a JSON-encoded body of the following form: `{ "query": "...", "variables": { "myVariable": "someValue", ... } }`
    - For a sample loan query see the "Basic Loan Query" section below
    - You can use this graphql playground (https://marketplace-api.k1.kiva.org/graphql) to help write whatever queries you would like

### Part Two

Create a simple endpoint that returns weather data. The specific data and format is not important, but consider object-oriented best practices.

- Use the included Kotlin REST app found in the `backend` folder
  - Create an endpoint that returns the current forecast data based on a provided latitude and longitude
    - The specific data returned is not important, can be simple, even just URLs to find more data, but needs to change based on latitude and longitude inputs
  - The National Weather Service provides a free weather API: https://www.weather.gov/documentation/services-web-api
    - An example available endpoint: https://api.weather.gov/points/{latitude},{longitude}

## Basic Loan Query via Graphql

https://marketplace-api.k1.kiva.org/graphql

Fetch 12 loans from the Agriculture sector

```
{
  lend {
    # Fetch a set of loans
    loans(limit: 12, offset: 0, filters: { sector: 1 }) {
      values {
        id
        name
        loanAmount
        loanFundraisingInfo {
          fundedAmount
        }
        image {
          url(customSize: "w480h300")
        }
        whySpecial
      }
    }
  }
}
```
