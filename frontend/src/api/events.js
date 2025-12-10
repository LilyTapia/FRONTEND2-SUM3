import mockEvents from './mockEvents';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const getMockList = () =>
  mockEvents.map(({ id, title, date, location, category, image }) => ({
    id,
    title,
    date,
    location,
    category,
    image,
  }));

export async function fetchEventsREST() {
  if (!API_URL) {
    return getMockList();
  }

  try {
    const response = await fetch(`${API_URL}/api/events`);
    if (!response.ok) {
      throw new Error('No se pudieron cargar los eventos');
    }
    return response.json();
  } catch (err) {
    console.warn('Fallo API remota, usando catálogo mock', err);
    return getMockList();
  }
}

export async function fetchEventDetailREST(id) {
  const mock = mockEvents.find((item) => String(item.id) === String(id));

  if (!API_URL) {
    if (mock) return mock;
    throw new Error('Evento no encontrado');
  }

  try {
    const response = await fetch(`${API_URL}/api/events/${id}`);
    if (!response.ok) {
      throw new Error('Evento no encontrado');
    }
    return response.json();
  } catch (err) {
    console.warn('Fallo API remota, usando catálogo mock', err);
    if (mock) return mock;
    throw new Error('No se pudo cargar el evento');
  }
}

export async function fetchEventDetailGraphQL(id) {
  const mock = mockEvents.find((item) => String(item.id) === String(id));

  if (!API_URL) {
    if (mock) return mock;
    throw new Error('No se pudo cargar el detalle');
  }

  const query = `
    query Event($id: ID!) {
      event(id: $id) {
        id
        title
        date
        location
        category
        organizer
        confirmed
        capacity
        description
        image
      }
    }
  `;

  try {
    const response = await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { id } }),
    });

    const result = await response.json();
    if (!response.ok || result.errors) {
      throw new Error(result.errors?.[0]?.message || 'No se pudo cargar el detalle');
    }

    return result.data.event;
  } catch (err) {
    console.warn('Fallo GraphQL remoto, usando catálogo mock', err);
    if (mock) return mock;
    throw new Error('No se pudo cargar el detalle');
  }
}
