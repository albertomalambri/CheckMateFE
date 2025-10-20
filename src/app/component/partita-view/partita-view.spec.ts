import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartitaService } from '../../service/partita.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Partita } from '../../model/partita.model';
import {PartitaViewComponent} from './partita-view';

describe('PartitaViewComponent', () => {
  let component: PartitaViewComponent;
  let fixture: ComponentFixture<PartitaViewComponent>;
  let mockService: jasmine.SpyObj<PartitaService>;

  const mockPartita: Partita = {
    id: 1,
    giocatoreBianco: 'Alberto',
    giocatoreNero: 'Stockfish',
    risultato: '1-0',
    statoFinaleFEN: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    mosse: [
      { numero: 1, da: 'e2', a: 'e4', pezzo: 'pedone', cattura: false, arrocco: false, promozione: false },
      { numero: 1, da: 'c7', a: 'c5', pezzo: 'pedone', cattura: false, arrocco: false, promozione: false }
    ]
  };

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('PartitaService', ['getPartita']);
    mockService.getPartita.and.returnValue(of(mockPartita));

    await TestBed.configureTestingModule({
      imports: [PartitaViewComponent, CommonModule],
      providers: [{ provide: PartitaService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(PartitaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load partita from service', () => {
    expect(component.partita).toEqual(mockPartita);
    expect(mockService.getPartita).toHaveBeenCalled();
  });
});
