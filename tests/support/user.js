import { randomUUID } from 'node:crypto';

export function newUser() {
  return {
    name: 'Aline Automation', email: `ae-${randomUUID()}@example.com`,
    password: `Test!${randomUUID()}`, title: 'Mrs',
    birth_date: '15', birth_month: '6', birth_year: '1995',
    firstname: 'Aline', lastname: 'Automation', company: 'Academic QA',
    address1: '123 Test Street', address2: 'Apartment 10', country: 'Canada',
    state: 'Ontario', city: 'Toronto', zipcode: 'M5V1A1', mobile_number: '4165550100',
  };
}
