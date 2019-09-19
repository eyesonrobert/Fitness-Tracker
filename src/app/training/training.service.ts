import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';


@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    availableExercises: Exercise[] = [];
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService) { }

    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true);
        this.fbSubs.push(this.db
            .collection('availableExercises')
            .snapshotChanges()
            .pipe(
                map(docArray => {
                    return docArray.map(doc => {
                        return {
                            id: doc.payload.doc.id,
                            ...doc.payload.doc.data()
                        } as Exercise;
                    });
                })
            )
            .subscribe((exercises: Exercise[]) => {
                this.uiService.loadingStateChanged.next(false);

                this.availableExercises = exercises;

                this.exercisesChanged.next([...this.availableExercises]);
            },
                error => {
                    this.uiService.loadingStateChanged.next(false);

                    this.uiService.showSnackbar('Could Not Show Exercises', null, 3000);

                    this.exercisesChanged.next(null);

                }));
    }

    startExercise(selectedId: string) {
        const selectedExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.runningExercise = selectedExercise;
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    getrunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises);
        }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    completeExercise() {
        this.addDataToDataBase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDataBase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    private addDataToDataBase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}
