import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 3) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const searchQuery = `${query}, Kerala`;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`, {
          headers: {
            'Accept-Language': 'en'
          }
        });
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (result) => {
    setQuery(result.display_name.split(',')[0]);
    setShowDropdown(false);
    onLocationSelect({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.display_name
    });
  };

  return (
    <div className="search-container" ref={dropdownRef}>
      <div className="search-input-wrapper">
        <Search size={20} color="var(--text-muted)" style={{ marginRight: '12px' }} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for a city, town, or area in Kerala..." 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => { if (query.length >= 3) setShowDropdown(true); }}
        />
        {isSearching && <div style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}>Loading...</div>}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="search-results">
          {results.map((result) => (
            <div 
              key={result.place_id} 
              className="search-result-item"
              onClick={() => handleSelect(result)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={16} color="var(--accent-primary)" />
                <div>
                  <div className="search-result-name">{result.display_name.split(',')[0]}</div>
                  <div className="search-result-desc">{result.display_name.split(',').slice(1).join(',')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
