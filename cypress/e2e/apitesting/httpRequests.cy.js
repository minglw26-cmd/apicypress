describe('HTTP requests', () => {

    // it('GET call should have status code 200', () => {
    //     cy.request('GET', 'https://jsonplaceholder.cypress.io/comments')
    //         .its('status')
    //         .should('eq', 200);
    // })

    // it('GET call response with status code check', () => {
    //     cy.request('GET', 'https://jsonplaceholder.cypress.io/comments')
    //     .should((response) => {
    //         expect(response.status).to.eq(200);
    //         console.log('Response body: ', response.body);
    //     })
    // })


    describe('Booking website - Restful booker', () => {
        const baseURLbooking = 'https://restful-booker.herokuapp.com'

        it('GET booking Ids', () => {
            cy.request(`${baseURLbooking}/booking`).should((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array').and.not.be.empty;
                expect(response.body[0]).to.have.property('bookingid');

                console.log('Bookings: ', response);
            })
        })

        it('GET booking', () => {
            cy.request(`${baseURLbooking}/booking/1`).should((response) => {
                expect(response.status).to.eq(200);
                console.log('Booking #1 details: ', response);
            })
        })

        const newEntry = {
            firstname: 'testuser',
            lastname: 'testa',
            totalprice: 199,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-10-10',
                checkout: '2026-10-15'
            },
            additionalneeds: 'Breakfast',
        }

        let token
        let bookingId

        before(() => {
            cy.request({
                method: 'POST',
                url: `${baseURLbooking}/auth`,
                headers: { 'Content-Type': 'application/json' },
                body: { username: 'admin', password: 'password123' },
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('token')
                token = response.body.token
            });
        })

        it('POST create a new entry', () => {
            cy.request({
                method: 'POST',
                url: `${baseURLbooking}/booking`,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                /*
                body: {
                    firstname: 'testuser',
                    lastname: 'testa',
                    totalprice: 199,
                    depositpaid: true,
                    bookingdates: {
                        checkin: '2026-10-10',
                        checkout: '2026-10-15'
                    },
                    additionalneeds: 'Breakfast',
                }
                // should move the above user/body out into a const for reuse (assertions in follow up tests)
                */

                body: newEntry,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('bookingid').and.be.a('number');
                expect(response.body.booking).to.deep.eq(newEntry);
                console.log('Booking/body: ', response.body);
                // cy.pause();
                bookingId = response.body.bookingid
                console.log('Booking Id is now: ', bookingId);
            });
        })

        it('GET filter the bookings', () => {
            cy.request({
                method: 'GET',
                url: `${baseURLbooking}/booking`,
                headers: {
                    Accept: 'application/json',
                }
            }).then((response) => {
                // expect(response.status).to.eq(200);
                // expect(response.body).to.have.property('bookingid').and.be.a('number');
                // bookingId = response.body.bookingid;

                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array').and.not.be.empty;
                expect(response.body.map((b) => b.bookingid)).to.include(bookingId);
                console.log('Booking Id2 is now: ', bookingId);
            })
        })

        it('returns the booking above', () => {
            cy.request({
                method: 'GET',
                url: `${baseURLbooking}/booking/${bookingId}`,
                headers: {
                    Accept: 'application/json'
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.deep.eq(newEntry);
            })
        })

    })
})