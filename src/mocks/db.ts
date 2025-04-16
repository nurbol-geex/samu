import {factory, primaryKey} from '@mswjs/data';
import {faker} from '@faker-js/faker';

export const db = factory({
  user: {
    id: primaryKey(faker.string.uuid),
  },
  account: {
    id: primaryKey(faker.string.uuid),
    email: faker.internet.email(),
    firstName: faker.person.firstName,
    lastName: faker.person.lastName,
    phone: faker.phone,
    emailVerified: Boolean,
    phoneVerified: Boolean,
  },
});
