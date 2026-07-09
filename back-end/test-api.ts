async function main() {
  try {
    const res = await fetch('http://localhost:3333/api/professionals/public/shaarthluaan');
    console.log('Response:', res.status, await res.text());
  } catch (err: any) {
    console.error('Error:', err);
  }
}
main();
