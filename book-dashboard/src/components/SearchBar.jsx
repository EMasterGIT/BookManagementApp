// src/components/SearchBar.jsx
export default function SearchBar({ search, setSearch }) {
    return (
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: '10px 0', padding: '5px', width: '300px' }}
      />
    );
  }