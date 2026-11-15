import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import {
  SpotifyLogo,
  GitHubLogo,
  AndroidLogo,
  NetCoreLogo,
  CppLogo,
  UnrealLogo,
  UnityLogo,
  NextjsLogo,
  PlayzAnimeLogo,
  EmberfigLogo,
  ArenaLogo,
  FlutterLogo,
} from './BrandLogos';

describe('BrandLogos Component & SVG ID Uniqueness Tests', () => {
  it('renders all official brand logos without crashing', () => {
    const logos = {
      SpotifyLogo,
      GitHubLogo,
      AndroidLogo,
      NetCoreLogo,
      CppLogo,
      UnrealLogo,
      UnityLogo,
      NextjsLogo,
      PlayzAnimeLogo,
      EmberfigLogo,
      ArenaLogo,
      FlutterLogo,
    };
    for (const [name, comp] of Object.entries(logos)) {
      expect(comp).toBeDefined();
      expect(typeof comp).toBe('function');
    }

    const { container } = render(
      <div>
        <SpotifyLogo />
        <GitHubLogo />
        <AndroidLogo />
        <NetCoreLogo />
        <CppLogo />
        <UnrealLogo />
        <UnityLogo />
        <NextjsLogo />
        <PlayzAnimeLogo />
        <EmberfigLogo />
        <ArenaLogo />
        <FlutterLogo />
      </div>
    );
    expect(container.querySelectorAll('svg').length).toBe(12);
  });

  it('generates unique linearGradient IDs when NextjsLogo is rendered multiple times', () => {
    const { container } = render(
      <div>
        <NextjsLogo />
        <NextjsLogo />
        <NextjsLogo />
      </div>
    );

    const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    expect(duplicates).toEqual([]);
    expect(ids.length).toBe(6); // 2 gradients per logo * 3 logos
  });
});
